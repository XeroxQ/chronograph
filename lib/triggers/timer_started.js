const Homey = require('homey');

class TimerStarted extends Homey.FlowCardTriggerDevice {
	constructor(triggerId) {
		super(triggerId);
		this.register();
	}
}

module.exports = TimerStarted;