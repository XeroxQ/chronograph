const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Timer.generateId(args.name) == state.timerId);
		});

		// Listen for timer started events that should trigger this card.
		Timer.events.on('started', (timer) => {
			this.trigger({
				// Tokens.
				"name": timer.getName(),
				"seconds": Math.round(timer.getDuration() / 1e1) / 1e2
			}, {
				// State.
				"timerId": timer.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TimerStarted;
