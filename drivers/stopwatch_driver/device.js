'use strict';

const Homey = require('homey');
const Stopwatch = require('../../lib/stopwatch.js');

class StopwatchDevice extends Homey.Device {
	onInit() {
		var self = this;

		let id = self.getData().id;

		this.registerCapabilityListener('onoff.0', async (value) => {
			var stopwatch = Stopwatch.get(id);
			if (!!stopwatch) {
				stopwatch.stop();
			} else {
				new Stopwatch(id, self.getName(), self);
			}
			Promise.resolve();
		});

		this.ready(async () => {
			self.setCapabilityValue('duration', NaN);
			self.setCapabilityValue('alarm_running', false);
			self.setCapabilityValue('onoff.0', false);
			self.log('Stopwatch device ready.');
		});

		self.log('Stopwatch device initialized.');
	}

	onAdded() {
		this.log('Stopwatch device added.');
	}

	onDeleted() {
		let stopwatch = Stopwatch.get(this.getData().id);
		if (!!stopwatch) {
			stopwatch.destroy();
		}

		this.log('Stopwatch device deleted.');
	}

	onRenamed(name) {
		let stopwatch = Stopwatch.get(this.getData().id);
		if (!!stopwatch) {
			stopwatch.setName(name);
		}

		this.log('Stopwatch device renamed.');
	}
}

module.exports = StopwatchDevice;
