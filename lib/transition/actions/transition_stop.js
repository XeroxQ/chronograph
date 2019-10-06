const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TransitionStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener(args => {
			let id = Utils.generateId(ChronographType.TRANSITION, args.name);
			let transition = Chronograph.get(id);
			if (!!transition) {
				transition.stop();
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("transition_not_running", { "name": args.name })));
		});
	}
}

module.exports = TransitionStop;
