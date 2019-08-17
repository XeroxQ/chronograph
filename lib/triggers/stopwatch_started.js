const Homey = require('homey');

class StopwatchStarted extends Homey.FlowCardTriggerDevice {
    constructor(triggerId) {
        super(triggerId);
    }
}

module.exports = StopwatchStarted;