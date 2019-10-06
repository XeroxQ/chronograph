const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchStopped extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Utils.generateId(ChronographType.STOPWATCH, args.name) == state.stopwatchId);
		});

		// Listen for chronograph stopped events that should trigger this card.
		Chronograph.events.on('stopped', chronograph => {
			if (chronograph.getData('type') != ChronographType.STOPWATCH) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName(),
				"seconds": Math.round(chronograph.getDuration() / 1e1) / 1e2
			}, {
				// State.
				"stopwatchId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = StopwatchStopped;
