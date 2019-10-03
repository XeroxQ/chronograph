const Homey = require('homey');
const Transition = require('../transition.js');

class TransitionPause extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let transition = Transition.get(args.name);
			if (!!transition) {
				transition.pause();
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("transition_not_running", { "name": args.name })));
		});
	}
}

module.exports = TransitionPause;
