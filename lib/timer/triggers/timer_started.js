const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TimerStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Chronograph.generateId(ChronographType.TIMER, args.name) == state.timerId);
		});

		// Listen for chronograph started events that should trigger this card.
		Chronograph.events.on('started', chronograph => {
			if (chronograph.getPrefix() != ChronographType.TIMER) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName(),
				"seconds": Math.round(chronograph.getTargetDuration() / 1e1) / 1e2
			}, {
				// State.
				"timerId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TimerStarted;
