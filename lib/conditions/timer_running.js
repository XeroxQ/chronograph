const Homey = require('homey');
const Timer = require('../timer.js');

class TimerRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Timer.generateId(args.name);
			let timer = Timer.get(id);
			return Promise.resolve(!!timer);
		});
	}
}

module.exports = TimerRunning;
