'use strict';

const Homey = require('homey');
const Timer = require('../../lib/timer.js');

class TimerDevice extends Homey.Device {
	onInit() {
		var self = this;

		let id = self.getData().id;

		// Register a handler for when a timer is started through the Homey ui.
		self.registerCapabilityListener('onoff.0', async (value) => {
			let settings = self.getSettings();
			let duration = parseInt(settings.default_seconds);
			if (duration <= 0) {
				return;
			}

			if (value) {
				new Timer(id, self, duration);
			} else {
				let timer = Timer.timers[id];
				if (timer) {
					timer.Stop();
				}
			}
		});

		// A timer device is turned off by default.
		self.setCapabilityValue('onoff.0', false);

		// A timer device in idle state should show the default duration.
		let settings = self.getSettings();
		let duration = parseInt(settings.default_seconds);
		if (duration > 0) {
			self.setCapabilityValue('seconds', duration);
		}

		self.log('Device initialized.');
	}

	onAdded() {
		this.log('Device added.');
	}

	onDeleted() {
		this.log('Device deleted.');
	}

	async onSettings(oldSettings, newSettings, changedKeys) {
		// When the default duration of the timer is changed and the timer is not running,
		// the device ui should show the default duration.
		let id = this.getData().id;
		if (!Timer.IsRunning(id)) {
			let duration = parseInt(newSettings.default_seconds);
			if (duration > 0) {
				this.setCapabilityValue('seconds', duration);
			}
		}
	}
}

module.exports = TimerDevice;
