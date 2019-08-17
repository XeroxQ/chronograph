const StopwatchCompare = require('./stopwatch_compare.js');

class StopwatchRandomCompare extends StopwatchCompare {
    constructor(conditionId) {
        super(conditionId);
    }
}

module.exports = StopwatchRandomCompare;