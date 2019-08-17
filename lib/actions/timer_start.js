const Homey = require('homey');

class TimerStart extends Homey.FlowCardAction {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = TimerStart;