const StopwatchRunning = require('./stopwatch_running.js');

class StopwatchRandomRunning extends StopwatchRunning {
    constructor(conditionId) {
        super(conditionId);
    }
}

module.exports = StopwatchRandomRunning;