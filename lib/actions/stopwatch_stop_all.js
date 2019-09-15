const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStopAll extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			Stopwatch.all().forEach((stopwatch) => {
				stopwatch.stop();
			});

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStopAll;
