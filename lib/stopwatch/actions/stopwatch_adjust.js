const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = Utils.evalTime(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Utils.generateId(ChronographType.STOPWATCH, args.name);
			let stopwatch = Chronograph.get(id);
			if (!!stopwatch) {
				stopwatch.adjust(time, args.unit);
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": args.name })));
		});
	}
}

module.exports = StopwatchAdjust;
