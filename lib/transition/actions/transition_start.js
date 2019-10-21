const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TransitionStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			if (!Utils.validateName(args.name)) {
				return Promise.reject(new Error(Homey.__("invalid_name")));
			}

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

			let id = Utils.generateId(ChronographType.TRANSITION, args.name);
			let transition = new Chronograph(id, args.name, time, args.unit);
			transition.setData('type', ChronographType.TRANSITION);
			transition.setData('from', from);
			transition.setData('to', to);
			transition.setData('steps', steps);

			steps--;
			let stepDuration = transition.getTargetDuration() / steps;
			if (stepDuration < 250) {
				return Promise.reject(new Error(Homey.__('invalid_transition')));
			}
			while(--steps > 0) {
				transition.addSplit(steps * stepDuration, 'milliseconds');
			}

			transition.start();

			return Promise.resolve(true);
		});
	}
}

module.exports = TransitionStart;
