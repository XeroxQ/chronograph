const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TransitionStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			if (args.name.includes('*')) {
				let regexp = Utils.wildcardToRegExp(args.name);
				return Promise.resolve(regexp.test(state.name));
			} else {
				return Promise.resolve(Utils.generateId(ChronographType.TRANSITION, args.name) == state.id);
			}
		});

		// Listen for chronograph started events that should trigger this card.
		Chronograph.events.on('started', chronograph => {
			if (chronograph.getData('type') != ChronographType.TRANSITION) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName(),
				"seconds": Math.round(chronograph.getTargetDuration() / 1e1) / 1e2
			}, {
				// State.
				"id": chronograph.getId(),
				"name": chronograph.getName()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TransitionStarted;
