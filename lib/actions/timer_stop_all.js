const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStopAll extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			Timer.all().forEach((timer) => {
				timer.stop();
			});

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStopAll;
