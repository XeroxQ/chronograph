const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class StopwatchStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Utils.generateId(ChronographType.STOPWATCH, args.name);
			let stopwatch = Chronograph.get(id);
			if (!!stopwatch) {
				stopwatch.stop();
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": args.name })));
		});
	}
}

module.exports = StopwatchStop;
