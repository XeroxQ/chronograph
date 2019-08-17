const Homey = require('homey');

class StopwatchRandomStarted extends Homey.FlowCardTrigger {
    constructor(triggerId) {
        super(triggerId);
    }
}

module.exports = StopwatchRandomStarted;