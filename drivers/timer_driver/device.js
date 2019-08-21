'use strict';

const Homey = require('homey');
const Chronograph = require('../../lib/chronograph.js');
const Timer = require('../../lib/timer.js');

class TimerDevice extends Homey.Device {
	onInit() {
		var self = this;

		// Register a handler for when a timer is started through the Homey ui.
		this.registerCapabilityListener('onoff.0', async (value) => {
			let id = self.getData().id;
			let settings = self.getSettings();
			let duration = parseInt(settings.default_seconds);
			if (duration > 0 && value) {
				let timer = new Timer(id, self, duration, (timer) => {
					self.setCapabilityValue('onoff.0', false);
					delete Chronograph.timers[timer.id];
				});
				Chronograph.timers[id] = timer;
			} else {
				Chronograph.timers[id].Stop();
				delete Chronograph.timers[id];
			}
		});

		// A timer device is turned off by default.
		this.setCapabilityValue('onoff.0', false)
			.catch(error => this.log(error));

		this.log('Device initialized.');
	}

	onAdded() {
		this.log('Device added.');
	}

	onDeleted() {
		this.log('Device deleted.');
	}
}

module.exports = TimerDevice;
