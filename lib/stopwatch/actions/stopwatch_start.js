const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let stopwatch = new Chronograph(ChronographType.STOPWATCH, args.name);

			let splits = Homey.ManagerSettings.get('stopwatch_splits') || [];
			splits
				.filter(split => split.name == stopwatch.getName())
				.forEach(split => stopwatch.addSplit(split.time, split.unit, split));

			stopwatch.start();

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStart;
