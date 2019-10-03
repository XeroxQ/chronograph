const Homey = require('homey');
const Transition = require('../transition.js');
const { Utils } = require('../../utils.js');

class TransitionCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let transition = Transition.get(args.name);
			if (!!transition) {
				return Promise.resolve(transition.getDuration() > Utils.calculateDuration(time, args.unit));
			}

			return Promise.reject(new Error(Homey.__("transition_not_running", { "name": args.name })));
		});
	}
}

module.exports = TransitionCompare;
