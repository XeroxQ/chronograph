const TimerRunning = require('./timer_running.js');

class TimerRandomRunning extends TimerRunning {
    constructor(conditionId) {
        super(conditionId);
    }
}

module.exports = TimerRandomRunning;