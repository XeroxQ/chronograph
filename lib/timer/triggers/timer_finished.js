const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TimerFinished extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Utils.generateId(ChronographType.TIMER, args.name) == state.timerId);
		});

		// Listen for chronograph finished events that should trigger this card.
		Chronograph.events.on('finished', chronograph => {
			if (chronograph.getData('type') != ChronographType.TIMER) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName()
			}, {
				// State.
				"timerId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TimerFinished;
