const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TransitionResume extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = Utils.evalTime(args.time);
			if (
				isNaN(time) ||
				time <= 0
			) {
				return Promise.reject(new Error(Homey.__('invalid_duration')));
			}

			/*
			let from = parseFloat(args.from);
			let to = parseFloat(args.to);
			let steps = parseInt(args.steps);
			if (
				isNaN(from)
				|| isNaN(to)
				|| isNaN(steps)
				|| steps < 2
			) {
				return Promise.reject(new Error(Homey.__('invalid_transition')));
			}
			*/

			let transition = Chronograph.get(ChronographType.TRANSITION, args.name);
			if (!transition) {
				let transition = new Chronograph(ChronographType.TRANSITION, args.name, time, args.unit);
				transition.start();
			} else {
				if (!transition.isRunning()) {
					transition.resume();
				}
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = TransitionResume;
