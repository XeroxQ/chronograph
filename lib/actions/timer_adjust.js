const Homey = require('homey');

class TimerAdjust extends Homey.FlowCardAction {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = TimerAdjust;