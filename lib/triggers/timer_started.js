const Homey = require('homey');

class TimerStarted extends Homey.FlowCardTriggerDevice {
    constructor(triggerId) {
        super(triggerId);
    }
}

module.exports = TimerStarted;