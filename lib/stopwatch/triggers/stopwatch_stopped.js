const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStopped extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Stopwatch.generateId(args.name) == state.stopwatchId);
		});

		// Listen for stopwatch stopped events that should trigger this card.
		Stopwatch.events.on('stopped', (stopwatch) => {
			this.trigger({
				// Tokens.
				"name": stopwatch.getName(),
				"seconds": Math.round(stopwatch.getDuration() / 1e1) / 1e2
			}, {
				// State.
				"stopwatchId": stopwatch.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = StopwatchStopped;
