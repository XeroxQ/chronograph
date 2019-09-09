const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Timer.generateId(args.name);
			let name = args.name;
			let timer = Timer.get(id);
			if (!!timer) {
				timer.stop(false);
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": name })));
		});
	}
}

module.exports = TimerStop;
