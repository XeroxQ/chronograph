'use strict';

const Homey = require('homey');
const Timer = require('../../lib/timer.js');

class TimerDriver extends Homey.Driver {
	onPairListDevices(data, callback) {
		callback( null, [
			{
				name: 'Timer',
				data: {
					id: Timer.generateId(Math.random().toString(36).substr(2, 9))
				}
			}
		]);
	}
}

module.exports = TimerDriver;