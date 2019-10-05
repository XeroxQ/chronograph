const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class StopwatchResume extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let stopwatch = Chronograph.get(ChronographType.STOPWATCH, args.name);
			if (!stopwatch) {
				stopwatch = new Chronograph(ChronographType.STOPWATCH, args.name);

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
