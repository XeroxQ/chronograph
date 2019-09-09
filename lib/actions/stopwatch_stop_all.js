const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStopAll extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			for (var stopwatchId in Stopwatch.stopwatches) {
				let stopwatch = Stopwatch.get(stopwatchId);
				if (!!stopwatch) {
					stopwatch.stop(false);
				}
			}
			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStopAll;
