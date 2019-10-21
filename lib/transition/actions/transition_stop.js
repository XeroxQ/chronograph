const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TransitionStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener(args => {
			if (args.name.includes('*')) {
				let regexp = Utils.wildcardToRegExp(args.name);
				Chronograph.all().forEach(chronograph => {
					if (
						chronograph.getData('type') == ChronographType.TRANSITION
						&& regexp.test(chronograph.getName())
					) {
						chronograph.stop();
					}
				});

				return Promise.resolve(true);
			} else {
				let id = Utils.generateId(ChronographType.TRANSITION, args.name);
				let transition = Chronograph.get(id);
				if (!!transition) {
					transition.stop();
					return Promise.resolve(true);
				}

				return Promise.reject(new Error(Homey.__("transition_not_running", { "name": args.name })));
			}
		});
	}
}

module.exports = TransitionStop;
