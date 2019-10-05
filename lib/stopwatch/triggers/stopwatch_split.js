const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchSplit extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(
				Chronograph.generateId(ChronographType.STOPWATCH, args.name) == state.stopwatchId
				&& args.time == state.time
				&& args.unit == state.unit);
		});

		// Listen for chronograph split events that should trigger this card.
		Chronograph.events.on('split', (chronograph, split) => {
			if (chronograph.getPrefix() != ChronographType.STOPWATCH) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName(),
				"seconds": Math.round(Utils.calculateDuration(split.data.time, split.data.unit) / 1e1) / 1e2
			}, {
				// State.
				"stopwatchId": chronograph.getId(),
				"time": split.data.time,
				"unit": split.data.unit
			}, () => {
				// Callback.
			});
		});

		// This method gets called everytime a flow is saved that has (or had) this
		// trigger card. The argument values contains an array with objects, one for
		// each instance of this trigger card.
		this.on('update', () => {
			this.getArgumentValues().then(args => {
				// The only thing we can do with the arguments here is storing
				// them for retrieval once a stopwatch is started.
				Homey.ManagerSettings.set('stopwatch_splits', args);
			});
		});
	}
}

module.exports = StopwatchSplit;
