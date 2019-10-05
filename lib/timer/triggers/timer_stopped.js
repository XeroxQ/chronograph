const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TimerStopped extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Chronograph.generateId(ChronographType.TIMER, args.name) == state.timerId);
		});

		// Listen for chronograph stopped events that should trigger this card.
		Chronograph.events.on('stopped', chronograph => {
			if (chronograph.getPrefix() != ChronographType.TIMER) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName(),
				"seconds": Math.round((chronograph.getTargetDuration() - chronograph.getDuration()) / 1e1) / 1e2
			}, {
				// State.
				"timerId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TimerStopped;
