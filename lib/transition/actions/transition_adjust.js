const Homey = require('homey');
const Transition = require('../transition.js');
const { Utils } = require('../../utils.js');

class TransitionAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = Utils.evalTime(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let transition = Transition.get(args.name);
			if (!!transition) {
				transition.adjust(time, args.unit);
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("transition_not_running", { "name": args.name })));
		});
	}
}

module.exports = TransitionAdjust;
