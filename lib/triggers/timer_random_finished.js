const Homey = require('homey');

class TimerRandomFinished extends Homey.FlowCardTrigger {
    constructor(triggerId) {
        super(triggerId);
    }
}

module.exports = TimerRandomFinished;