'use strict';

const Homey = require('homey');
const Timer = require('../../lib/timer.js');

class TimerDevice extends Homey.Device {
	onInit() {
		var self = this;

		let id = this.getData().id;

		this.registerCapabilityListener('button.0', async (value) => {
			var timer = Timer.get(id);
			if (!!timer) {
				timer.stop();
			}
			Promise.resolve();
		});

		this.ready(async () => {
			self.setCapabilityValue('duration', NaN);
			self.setCapabilityValue('alarm_running', false);
			self.log('Timer device ready.');
		});

		this.log('Timer device initialized.');
	}

	onAdded() {
		this.log('Timer device added.');
	}

	onDeleted() {
		let timer = Timer.get(this.getData().id);
		if (!!timer) {
			timer.destroy();
		}

		this.log('Timer device deleted.');
	}

	onRenamed(name) {
		let timer = Timer.get(this.getData().id);
		if (!!timer) {
			timer.setName(name);
		}

		this.log('Timer device renamed.');
	}
}

module.exports = TimerDevice;
