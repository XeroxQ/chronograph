const Homey = require('homey');

class TimerStop extends Homey.FlowCardAction {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = TimerStop;