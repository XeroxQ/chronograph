const Homey = require('homey');

class StopwatchStart extends Homey.FlowCardAction {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = StopwatchStart;