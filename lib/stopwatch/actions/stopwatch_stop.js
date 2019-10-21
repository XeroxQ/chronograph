const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			if (args.name.includes('*')) {
				let regexp = Utils.wildcardToRegExp(args.name);
				Chronograph.all().forEach(chronograph => {
					if (
						chronograph.getData('type') == ChronographType.STOPWATCH
						&& regexp.test(chronograph.getName())
					) {
						chronograph.stop();
					}
				});

				return Promise.resolve(true);
			} else {
				let id = Utils.generateId(ChronographType.STOPWATCH, args.name);
				let stopwatch = Chronograph.get(id);
				if (!!stopwatch) {
					stopwatch.stop();
					return Promise.resolve(true);
				}

				return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": args.name })));
			}
		});
	}
}

module.exports = StopwatchStop;
