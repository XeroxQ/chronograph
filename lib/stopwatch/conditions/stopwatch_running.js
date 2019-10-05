const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let stopwatch = Chronograph.get(ChronographType.STOPWATCH, args.name);
			return Promise.resolve(!!stopwatch && stopwatch.isRunning());
		});
	}
}

module.exports = StopwatchRunning;
