const Homey = require('homey');
const Timer = require('../timer.js');

class TimerFinished extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Timer.generateId(args.name) == state.timerId);
		});

		// Listen for timer finished events that should trigger this card.
		Timer.events.on('finished', (timer) => {
			this.trigger({
				// Tokens.
				"name": timer.getName()
			}, {
				// State.
				"timerId": timer.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TimerFinished;
