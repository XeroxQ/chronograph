const TimerStop = require('./timer_stop.js');

class TimerRandomStop extends TimerStop {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = TimerRandomStop;