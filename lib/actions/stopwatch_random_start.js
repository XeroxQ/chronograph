const StopwatchStart = require('./stopwatch_start.js');

class StopwatchRandomStart extends StopwatchStart {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = StopwatchRandomStart;