const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');
const { SplitTypes } = require('../utils.js');

class StopwatchSplit extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(
				Stopwatch.generateId(args.name) == state.stopwatchId
				&& args.time == state.time
				&& args.unit == state.unit);
		});

		// Listen for stopwatch split events that should trigger this card.
		Stopwatch.events.on('split', (stopwatch, split) => {
			if (split.data.type != SplitTypes.SPLIT) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": stopwatch.getName(),
				"seconds": Math.round(stopwatch.getDuration() / 1e1) / 1e2
			}, {
				// State.
				"stopwatchId": stopwatch.getId(),
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
