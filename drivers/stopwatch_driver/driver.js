'use strict';

const Homey = require('homey');

class StopwatchDriver extends Homey.Driver {
    onPairListDevices(data, callback) {
        this.log('driver on pair list');
        callback( null, [
            {
                name: 'Stopwatch',
                data: {
                    // The identifier is unique across the system. If the identifier already exists,
                    // Homey will respond with "no new devices found". Because we support more than
                    // one timer, we're going to generate a unique id here.
                    id: 'chronograph_stopwatch_' + Math.random().toString(36).substr(2, 9)
                }
            }
        ]);
    }
}

module.exports = StopwatchDriver;