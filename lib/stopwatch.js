const Homey = require('homey');
const Chronograph = require('./chronograph.js');

class Stopwatch {
	constructor(id, name, device) {
		var self = this;

		self._id = id;
		self._name = name;
		self._count = 0;
		self._device = device;

		// If there's already a stopwatch running, stop it first.
		let existingStopwatch = Stopwatch.stopwatches[self._id];
		if (!!existingStopwatch) {
			existingStopwatch.stop();
		}

		Stopwatch.stopwatches[self._id] = self;
		self._start();

		if (self._device instanceof Homey.Device) {
			Chronograph.cards.stopwatch_started.trigger(self._device, {
				// Tokens.
				"name": self._name
			}, {
				// State.
				"stopwatchId": self._id
			}, () => {
				// Callback.
			});
		} else {
			Chronograph.cards.stopwatch_random_started.trigger({
				// Tokens.
				"name": self._name
			}, {
				// State.
				"stopwatchId": self._id
			}, () => {
				// Callback.
			});
		}
	}

	getId() {
		return this._id;
	}

	getName() {
		return this._name;
	}

	setName(name) {
		this._name = name;
	}

	getDuration() {
		return this._count;
	}

	getDevice() {
		return this._device;
	}

	update(duration) {
		if (!!this._intervalReference) {
			this._count = Math.max(0, this._count + duration);

			if (this._device instanceof Homey.Device) {
				this._device.setCapabilityValue('seconds', this._count);
			}

			Chronograph.log("Stopwatch [" + this._name + "] updated.");
			return true;
		} else {
			return false;
		}
	}

	stop(deleted) {
		if (!!this._intervalReference) {
			clearInterval(this._intervalReference);
			this._intervalReference = null;
			delete Stopwatch.stopwatches[this._id];

			if (
				!deleted &&
				this._device instanceof Homey.Device
			) {
				this._resetDevice();
			}

			Chronograph.log("Stopwatch [" + this._name + "] stopped.");
			return true;
		} else {
			return false;
		}
	}

	_start() {
		var self = this;

		self._intervalReference = setInterval(() => {
			self._count++;
			if (self._device instanceof Homey.Device) {
				self._device.setCapabilityValue('seconds', self._count);
			}
		}, 1e3);

		Chronograph.log("Stopwatch [" + self._name + "] started.");
	}

	_resetDevice() {
		this._device.setCapabilityValue('seconds', 0);
		this._device.setCapabilityValue('running', false);
	}

	static generateId(name) {
		name = name.trim();
		var hash = 0, i, chr;
		if (name.length === 0) {
			return hash;
		}
		for (i = 0; i < name.length; i++) {
			chr = name.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return 'stopwatch_' + Math.abs(hash).toString() + '_' + name.toLowerCase().replace(/[^a-z]/g, '')
	}
}

Stopwatch.stopwatches = {};

module.exports = Stopwatch;
