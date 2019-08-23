'use strict';

const Homey = require('homey');
const Timer = require('../../lib/timer.js');

class TimerDevice extends Homey.Device {
	onInit() {
		var self = this;

		let id = self.getData().id;

		// Register a handler for when a timer is started through the Homey ui.
		self.registerCapabilityListener('running', async (value) => {
			let settings = self.getSettings();
			let duration = parseInt(settings.default_seconds);
			if (
				isNaN(duration) ||
				duration <= 0
			) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			if (value) {
				new Timer(id, self.getName(), duration, self);
			} else {
				let timer = Timer.timers[id];
				if (!!timer) {
					timer.stop();
				}
			}

			return Promise.resolve(true);
		});

		self.log('Timer device initialized.');
	}

	onAdded() {
		var self = this;
		this.ready(() => {
			// A timer device is turned off by default.
			self.setCapabilityValue('running', false);

			// A timer device in idle state should show the default duration.
			let settings = self.getSettings();
			let duration = parseInt(settings.default_seconds);
			if (
				!isNaN(duration) &&
				duration > 0
			) {
				self.setCapabilityValue('seconds', duration);
			}

			self.log('Timer device ready.');
		});
	}

	onDeleted() {
		let id = this.getData().id;
		let timer = Timer.timers[id];
		if (!!timer) {
			timer.stop(true);
		}

		this.log('Timer device deleted.');
	}

	onRenamed(name) {
		let id = this.getData().id;
		let timer = Timer.timers[id];
		if (!!timer) {
			timer.setName(name);
		}

		this.log('Timer device renamed.');
	}

	onSettings(oldSettings, newSettings, changedKeys) {
		// When the default duration of the timer is changed and the timer is not running,
		// the device ui should show the default duration.
		let id = this.getData().id;
		let timer = Timer.timers[id];
		if (!!timer) {
			let duration = parseInt(newSettings.default_seconds);
			if (
				!isNaN(duration) &&
				duration > 0
			) {
				this.setCapabilityValue('seconds', duration);
			}
		}
	}
}

module.exports = TimerDevice;
