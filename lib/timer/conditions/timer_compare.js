const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TimerCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Utils.generateId(ChronographType.TIMER, args.name);
			let timer = Chronograph.get(id);
			if (!!timer) {
				return Promise.resolve((timer.getTargetDuration() - timer.getDuration()) > Utils.calculateDuration(time, args.unit));
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": args.name })));
		});
	}
}

module.exports = TimerCompare;
