const Homey = require('homey');

class TimerRandomStarted extends Homey.FlowCardTrigger {
    constructor(triggerId) {
        super(triggerId);
    }
}

module.exports = TimerRandomStarted;