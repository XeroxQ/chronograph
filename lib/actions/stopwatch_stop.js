const Homey = require('homey');

class StopwatchStop extends Homey.FlowCardAction {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = StopwatchStop;