const Homey = require('homey');

class TimerRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);
	}
}

module.exports = TimerRunning;