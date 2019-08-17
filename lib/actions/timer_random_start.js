const TimerStart = require('./timer_start.js');

class TimerRandomStart extends TimerStart {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = TimerRandomStart;