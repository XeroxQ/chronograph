const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStopAll extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			for (var timerId in Timer.timers) {
				let timer = Timer.get(timerId);
				if (!!timer) {
					timer.stop(false);
				}
			}
			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStopAll;
