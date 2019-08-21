const Homey = require('homey');

class TimerCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);
	}
}

module.exports = TimerCompare;