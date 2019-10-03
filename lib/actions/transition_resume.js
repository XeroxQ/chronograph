const Homey = require('homey');
const Transition = require('../transition.js');
const { Utils } = require('../utils.js');

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

			let transition = Transition.get(args.name);
			if (!transition) {
				let transition = new Transition(args.name, time, args.unit, from, to, steps);
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
