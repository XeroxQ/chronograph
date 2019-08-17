const Homey = require('homey');

class TimerFinished extends Homey.FlowCardTriggerDevice {
    constructor(triggerId) {
        super(triggerId);
    }
}

module.exports = TimerFinished;