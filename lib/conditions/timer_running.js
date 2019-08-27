const Homey = require('homey');
const Timer = require('../timer.js');

class TimerRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let id;
			if (args.device) {
				id = args.device.getData().id;
			} else {
				id = Timer.generateId(args.name);
			}

			var timer = Timer.get(id);
			return Promise.resolve(!!timer);
		});
	}
}

module.exports = TimerRunning;