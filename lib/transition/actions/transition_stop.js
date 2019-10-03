const Homey = require('homey');
const Transition = require('../transition.js');

class TransitionStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let transition = Transition.get(args.name);
			if (!!transition) {
				transition.stop();
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("transition_not_running", { "name": args.name })));
		});
	}
}

module.exports = TransitionStop;
