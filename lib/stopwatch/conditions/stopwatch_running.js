const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Utils.generateId(ChronographType.STOPWATCH, args.name);
			let stopwatch = Chronograph.get(id);
			return Promise.resolve(!!stopwatch && stopwatch.isRunning());
		});
	}
}

module.exports = StopwatchRunning;
