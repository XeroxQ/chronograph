const Homey = require('homey');
const Timer = require('../timer.js');

class TimerResume extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (
				isNaN(time) ||
				time <= 0
			) {
				return Promise.reject(new Error(Homey.__('invalid_duration')));
			}

			let timer = Timer.get(args.name);
			if (!timer) {
				timer = new Timer(args.name, time, args.unit);
				let splits = Homey.ManagerSettings.get('timer_splits') || [];
				splits.forEach((split) => {
					timer.addSplit(split.time, split.unit);
				});
				timer.start();
			} else {
				if (!timer.isRunning()) {
					timer.resume();
				}
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerResume;
