const Homey = require('homey');
const Timer = require('../timer.js');

class TimerPause extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let timer = Timer.get(args.name);
			if (!!timer) {
				timer.pause();
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": args.name })));
		});
	}
}

module.exports = TimerPause;
