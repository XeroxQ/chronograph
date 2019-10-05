const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TransitionFinished extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Chronograph.generateId(ChronographType.TRANSITION, args.name) == state.transitionId);
		});

		// Listen for chronograph finished events that should trigger this card.
		Chronograph.events.on('finished', chronograph => {
			if (chronograph.getPrefix() != ChronographType.TRANSITION) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName()
			}, {
				// State.
				"transitionId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TransitionFinished;
