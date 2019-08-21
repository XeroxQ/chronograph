'use strict';

const Homey = require('homey');
//const Counter = require('../../lib/counter.js');

class StopwatchDevice extends Homey.Device {
	onInit() {
		var self = this;

		/*
		// Register a handler for when a stopwatch is started through the Homey ui.
		this.registerCapabilityListener('running', async (value) => {
			let id = self.getData().id;
			if (value) {
				let counter = new Counter(id, self, 0, (counter) => counter.count++);
				Chronograph.counters[id] = counter;
			} else {
				Chronograph.counters[id].Stop();
				delete Chronograph.counters[id];
			}
		});

		// A stopwatch device is turned off by default.
		this.setCapabilityValue('running', false)
			.catch(error => this.log(error));
		*/
		this.log('Device initialized.');
	}

	onAdded() {
		this.log('Device added.');
	}

	onDeleted() {
		this.log('Device deleted.');
	}
}

module.exports = StopwatchDevice;
