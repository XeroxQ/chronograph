const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Stopwatch.generateId(args.name) == state.stopwatchId);
		});

		// Listen for stopwatch started events that should trigger this card.
		Stopwatch.events.on('started', (stopwatch) => {
			this.trigger({
				// Tokens.
				"name": stopwatch.getName()
			}, {
				// State.
				"stopwatchId": stopwatch.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = StopwatchStarted;
