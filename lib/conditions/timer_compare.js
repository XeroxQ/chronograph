const Homey = require('homey');
const Chronograph = require('../chronograph.js');
const Timer = require('../timer.js');

class TimerCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Timer.generateId(args.name);
			let name = args.name;
			let timer = Timer.get(id);
			if (!!timer) {
				return Promise.resolve(timer.getDuration() > Chronograph.calculateDuration(time, args.unit));
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": name })));
		});
	}
}

module.exports = TimerCompare;
