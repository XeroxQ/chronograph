const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let stopwatch = new Stopwatch(args.name);
			let splits = Homey.ManagerSettings.get('stopwatch_splits') || [];
			splits.forEach(split => stopwatch.addSplit(split.time, split.unit, split));
			stopwatch.start();

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStart;
