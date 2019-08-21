const Homey = require('homey');
const Chronograph = require('./chronograph.js');

class Timer {
	constructor(id, device, count) {
		var self = this;

		self.id = id;
		self.device = device;
		self.count = count;

		Timer.timers[self.id] = self;

		if (self.device instanceof Homey.Device) {
			Chronograph.cards.timer_started.trigger(self.device, {
				// Tokens.
				"name": self.device.getName()
			}, {
				// State.
				"timer": self
			}, () => {
				// Callback.
				self._Start();
			});
		} else {
			Chronograph.cards.timer_random_started.trigger({
				// Tokens.
			}, {
				// State.
				"timer": self
			}, () => {
				// Callback.
				self._Start();
			});
		}
	}

	Stop() {
		clearInterval(this._intervalRef);
		if (this.device instanceof Homey.Device) {
			this._ResetDevice();
		}
		delete Timer.timers[this.id];
		Chronograph.log("Timer [" + this.id + "] stopped.");
	}

	_Start() {
		var self = this;

		self._intervalRef = setInterval(() => {
			self.count--;

			if (self.count == 0) {
				clearInterval(self._intervalRef);
				if (self.device instanceof Homey.Device) {
					Chronograph.cards.timer_finished.trigger(self.device, {
						// Tokens.
						"name": self.device.getName()
					}, {
						// State.
						"timer": self
					}, () => {
						// Callback.
						self._ResetDevice();
						delete Timer.timers[self.id];
					});
				} else {
					Chronograph.cards.timer_random_finished.trigger({
						// Tokens.
					}, {
						// State.
						"timer": self 
					}, () => {
						// Callback.
						delete Timer.timers[self.id];
					});
				}

				Chronograph.log("Timer [" + self.id + "] finished.");
			} else {
				if (self.device instanceof Homey.Device) {
					self.device.setCapabilityValue('seconds', self.count);
				}
			}
		}, 1e3);

		Chronograph.log("Timer [" + self.id + "] started.");
	}

	_ResetDevice() {
		let settings = this.device.getSettings();
		let duration = parseInt(settings.default_seconds);
		if (duration > 0) {
			this.device.setCapabilityValue('seconds', duration);
		}
		this.device.setCapabilityValue('onoff.0', false);
	}

	static IsRunning(timerId) {
		return !!Timer.timers[timerId];
	}

	static GenerateId(name) {
		var hash = 0, i, chr;
		if (name.length === 0) {
			return hash;
		}
		for (i = 0; i < name.length; i++) {
			chr = name.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return Math.abs(hash).toString() + name.toLowerCase().replace(/[^a-z]/g, '');
	}
}

Timer.timers = {};

module.exports = Timer;
