'use strict';

const Homey = require('homey');
const Stopwatch = require('../../lib/stopwatch.js');

class StopwatchDevice extends Homey.Device {
	onInit() {
		var self = this;

		let id = self.getData().id;

		// Register a handler for when a stopwatch is started through the Homey ui.
		self.registerCapabilityListener('running', async (value) => {
			if (value) {
				new Stopwatch(id, self.getName(), self);
			} else {
				let stopwatch = Stopwatch.stopwatches[id];
				if (!!stopwatch) {
					stopwatch.stop();
				}
			}

			return Promise.resolve(true);
		});

		self.log('Stopwatch device initialized.');
	}

	onAdded() {
		var self = this;
		this.ready(() => {
			// A stopwatch device is turned off by default.
			self.setCapabilityValue('running', false);

			// A stopwatch device in idle state should show zero.
			self.setCapabilityValue('seconds', 0);

			self.log('Stopwatch device ready.');
		});
	}

	onDeleted() {
		let id = this.getData().id;
		let stopwatch = Stopwatch.stopwatches[id];
		if (!!stopwatch) {
			stopwatch.stop(true);
		}

		this.log('Stopwatch device deleted.');
	}

	onRenamed(name) {
		let id = this.getData().id;
		let stopwatch = Stopwatch.stopwatches[id];
		if (!!stopwatch) {
			stopwatch.setName(name);
		}

		this.log('Stopwatch device renamed.');
	}
}

module.exports = StopwatchDevice;
