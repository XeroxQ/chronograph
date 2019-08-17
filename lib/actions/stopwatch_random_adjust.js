const StopwatchAdjust = require('./stopwatch_adjust.js');

class StopwatchRandomAdjust extends StopwatchAdjust {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = StopwatchRandomAdjust;