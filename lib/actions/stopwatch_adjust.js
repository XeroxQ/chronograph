const Homey = require('homey');

class StopwatchAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);
	}
}

module.exports = StopwatchAdjust;