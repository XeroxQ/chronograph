'use strict';

const Homey = require('homey');

class TimerDevice extends Homey.Device {
    onInit() {
        this.log('device init');
    }

    onAdded() {
        this.log('device added');
    }

    onDeleted() {
        this.log('device deleted');
    }

    onCapabilityBoolean( value, opts, callback ) {
        this.log('state change');
        this.log(value);
        this.log(opts);
        return Promise.resolve( true );
    }
}

module.exports = TimerDevice;