const Homey = require('homey');
const Transition = require('../transition.js');

class TransitionFinished extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Transition.generateId(args.name) == state.transitionId);
		});

		// Listen for transition finished events that should trigger this card.
		Transition.events.on('finished', (transition) => {
			this.trigger({
				// Tokens.
				"name": transition.getName()
			}, {
				// State.
				"transitionId": transition.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TransitionFinished;
