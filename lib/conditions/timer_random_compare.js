const TimerCompare = require('./timer_compare.js');

class TimerRandomCompare extends TimerCompare {
    constructor(conditionId) {
        super(conditionId);
    }
}

module.exports = TimerRandomCompare;