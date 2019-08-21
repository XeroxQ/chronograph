'use strict';

const Homey = require('homey');

class TimerDriver extends Homey.Driver {
	onPairListDevices(data, callback) {
		callback( null, [
			{
				name: 'Timer',
				data: {
					// The identifier is unique across the system. If the identifier already exists,
					// Homey will respond with "no new devices found". Because we support more than
					// one timer, we're going to generate a unique id here.
					id: 'chronograph_timer_' + Math.random().toString(36).substr(2, 9)
				}
			}
		]);
	}
}

module.exports = TimerDriver;