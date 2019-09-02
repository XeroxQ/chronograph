const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchSplit extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		var self = this;

		this.register();
		this.registerRunListener((args, state) => {
			var id = Stopwatch.generateId(args.name);
			return Promise.resolve(id == state.stopwatchId && args.seconds == state.seconds);
		});

		// This method gets called everytime a flow is saved that has (or had) this
		// trigger card. The argument values contains an array with objects, one for
		// each instance of this trigger card.
		this.on('update', () => {
			self.getArgumentValues().then(args => {
				// The only thing we can do with the arguments here is storing
				// them for retrieval once a stopwatch is started.
				Homey.ManagerSettings.set('stopwatch_splits', args);
			});
		});
	}
}

module.exports = StopwatchSplit;
