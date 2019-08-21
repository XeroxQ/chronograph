const Homey = require('homey');
const Chronograph = require('./chronograph.js');

class Timer {
	constructor(id, device, count, onFinish) {
		var self = this;

		self.id = id;
		self.device = device;
		self.count = count;

		self._onFinish = onFinish;

		if (self.device instanceof Homey.Device) {
			Chronograph.cards.timer_started.trigger(self.device, {
				// Tokens.
				"name": self.device.getName()
			}, {
				// State.
				"timer": self
			});
		} else {
			Chronograph.cards.timer_random_started.trigger({
				// Tokens.
			}, {
				// State.
				"timer": self
			});
		}

		this._intervalRef = setInterval(() => {
			self.count--;
			if (self.device instanceof Homey.Device) {
				self.device.setCapabilityValue('seconds', self.count);
			}
			if (self.count == 0) {
				clearInterval(self._intervalRef);
				if (self.device instanceof Homey.Device) {
					Chronograph.cards.timer_finished.trigger(self.device, {
						// Tokens.
						"name": self.device.getName()
					}, {
						// State.
						"timer": self
					}, () => self._onFinish(self));
				} else {
					Chronograph.cards.timer_random_finished.trigger({
						// Tokens.
					}, {
						// State.
						"timer": self 
					}, () => self._onFinish(self));
				}
				Chronograph.log("Timer [" + self.id + "] finished.");
			}
		}, 1e3);

		Chronograph.log("Timer [" + self.id + "] started.");
	}

	Stop() {
		clearInterval(this._intervalRef);
		Chronograph.log("Timer [" + this.id + "] stopped.");
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

module.exports = Timer;
