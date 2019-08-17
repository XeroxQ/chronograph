const Homey = require('homey');

class StopwatchRunning extends Homey.FlowCardCondition {
    constructor(conditionId) {
        super(conditionId);
    }
}

module.exports = StopwatchRunning;