const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TimerPaused extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Utils.generateId(ChronographType.TIMER, args.name) == state.timerId);
		});

		// Listen for chronograph paused events that should trigger this card.
		Chronograph.events.on('paused', chronograph => {
			if (chronograph.getData('type') != ChronographType.TIMER) {
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

module.exports = TimerPaused;
