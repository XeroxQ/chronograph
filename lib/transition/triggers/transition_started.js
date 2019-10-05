const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TransitionStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Chronograph.generateId(ChronographType.TRANSITION, args.name) == state.transitionId);
		});

		// Listen for chronograph started events that should trigger this card.
		Chronograph.events.on('started', chronograph => {
			if (chronograph.getPrefix() != ChronographType.TRANSITION) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName(),
				"seconds": Math.round(chronograph.getTargetDuration() / 1e1) / 1e2
			}, {
				// State.
				"transitionId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TransitionStarted;
