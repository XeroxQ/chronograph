const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TimerAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = Utils.evalTime(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			if (args.name.includes('*')) {
				let regexp = Utils.wildcardToRegExp(args.name);
				Chronograph.all().forEach(chronograph => {
					if (
						chronograph.getData('type') == ChronographType.TIMER
						&& regexp.test(chronograph.getName())
					) {
						chronograph.adjust(time, args.unit);
					}
				});

				return Promise.resolve(true);
			} else {
				let id = Utils.generateId(ChronographType.TIMER, args.name);
				let timer = Chronograph.get(id);
				if (!!timer) {
					timer.adjust(time, args.unit);
					return Promise.resolve(true);
				}

				return Promise.reject(new Error(Homey.__("timer_not_running", { "name": args.name })));
			}
		});
	}
}

module.exports = TimerAdjust;
