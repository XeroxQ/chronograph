const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchResume extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Utils.generateId(ChronographType.STOPWATCH, args.name);
			let stopwatch = Chronograph.get(id);
			if (!stopwatch) {
				stopwatch = new Chronograph(id, args.name);
				stopwatch.setData('type', ChronographType.STOPWATCH);

				let splits = Homey.ManagerSettings.get('stopwatch_splits') || [];
				splits
					.filter(split => split.name == stopwatch.getName())
					.forEach(split => stopwatch.addSplit(split.time, split.unit, split));

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
