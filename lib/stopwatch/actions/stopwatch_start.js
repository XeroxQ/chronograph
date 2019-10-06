const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Utils.generateId(ChronographType.STOPWATCH, args.name);
			let stopwatch = new Chronograph(id, args.name);
			stopwatch.setData('type', ChronographType.STOPWATCH);

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
