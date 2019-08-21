const Homey = require('homey');

class StopwatchCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);
	}
}

module.exports = StopwatchCompare;