const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id, name;
			if (args.device) {
				id = args.device.getData().id;
				name = args.device.getName();
			} else {
				id = Timer.generateId(args.name);
				name = args.name;
			}

			var timer = Timer.get(id);
			if (!!timer) {
				timer.stop();
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": name })));
		});
	}
}

module.exports = TimerStop;
