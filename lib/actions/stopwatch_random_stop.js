const StopwatchStop = require('./stopwatch_stop.js');

class StopwatchRandomStop extends StopwatchStop {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = StopwatchRandomStop;