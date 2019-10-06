const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Utils.generateId(ChronographType.STOPWATCH, args.name) == state.stopwatchId);
		});

		// Listen for chronograph started events that should trigger this card.
		Chronograph.events.on('started', (chronograph) => {
			if (chronograph.getData('type') != ChronographType.STOPWATCH) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName()
			}, {
				// State.
				"stopwatchId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = StopwatchStarted;
