const TimerAdjust = require('./timer_adjust.js');

class TimerRandomAdjust extends TimerAdjust {
    constructor(actionId) {
        super(actionId);
    }
}

module.exports = TimerRandomAdjust;