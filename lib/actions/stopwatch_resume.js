const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchResume extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let stopwatch = Stopwatch.get(args.name);
			if (!stopwatch) {
				stopwatch = new Stopwatch(args.name);
				let splits = Homey.ManagerSettings.get('stopwatch_splits') || [];
				splits.forEach(split => stopwatch.addSplit(split.time, split.unit, split));
				stopwatch.start();
			} else {
				if (!stopwatch.isRunning()) {
					stopwatch.resume();
				}
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchResume;
