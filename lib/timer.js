const Homey = require('homey');
const Chronograph = require('./chronograph.js');

class Timer {
	constructor(id, name, count, device) {
		var self = this;

		self._id = id;
		self._name = name;
		self._count = count;
		self._device = device;

		// If there's already a timer running, stop it first.
		let existingTimer = Timer.timers[self._id];
		if (!!existingTimer) {
			existingTimer.stop();
		}

		Timer.timers[self._id] = self;
		self._start();

		if (self._device instanceof Homey.Device) {
			Chronograph.cards.timer_started.trigger(self._device, {
				// Tokens.
				"name": self._name,
				"seconds": self._count
			}, {
				// State.
				"timerId": self._id
			}, () => {
				// Callback.
			});
		} else {
			Chronograph.cards.timer_random_started.trigger({
				// Tokens.
				"name": self._name,
				"seconds": self._count
			}, {
				// State.
				"timerId": self._id
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

			Chronograph.log("Timer [" + this._name + "] updated.");
			return true;
		} else {
			return false;
		}
	}

	stop(deleted) {
		if (!!this._intervalReference) {
			clearInterval(this._intervalReference);
			this._intervalReference = null;
			delete Timer.timers[this._id];

			if (
				!deleted &&
				this._device instanceof Homey.Device
			) {
				this._resetDevice();
			}

			Chronograph.log("Timer [" + this._name + "] stopped.");
			return true;
		} else {
			return false;
		}
	}

	_start() {
		var self = this;

		self._intervalReference = setInterval(() => {
			self._count = Math.max(0, self._count - 1);

			if (self._count == 0) {
				clearInterval(self._intervalReference);
				if (self._device instanceof Homey.Device) {
					Chronograph.cards.timer_finished.trigger(self._device, {
						// Tokens.
						"name": self._name
					}, {
						// State.
						"timerId": self._id
					}, () => {
						// Callback.
						self._resetDevice();
						delete Timer.timers[self._id];
					});
				} else {
					Chronograph.cards.timer_random_finished.trigger({
						// Tokens.
						"name": self._name
					}, {
						// State.
						"timerId": self._id
					}, () => {
						// Callback.
						delete Timer.timers[self._id];
					});
				}

				Chronograph.log("Timer [" + self._name + "] finished.");
			} else {
				if (self._device instanceof Homey.Device) {
					self._device.setCapabilityValue('seconds', self._count);
				}
			}
		}, 1e3);

		Chronograph.log("Timer [" + self._name + "] started.");
	}

	_resetDevice() {
		let settings = this._device.getSettings();
		let duration = parseInt(settings.default_seconds);
		if (duration > 0) {
			this._device.setCapabilityValue('seconds', duration);
		}
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
		return 'timer_' + Math.abs(hash).toString() + '_' + name.toLowerCase().replace(/[^a-z]/g, '');
	}
}

Timer.timers = {};

module.exports = Timer;
