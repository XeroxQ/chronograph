const Homey = require('homey');
const Timer = require('../timer.js');

class TimerRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let timer = Timer.get(args.name);
			return Promise.resolve(!!timer);
		});
	}
}

module.exports = TimerRunning;
