'use strict';

const Homey = require('homey');
const Chronograph = require('./chronograph.js');

const UPDATE_INTERVAL_MS = 250;

class Timer {
	constructor(id, name, duration, device) {
		this._id = id;
		this._name = name;
		this._duration = duration;
		this._device = device;

		// If there's already a timer running, stop it first.
		let existingTimer = Timer.get(id);
		if (!!existingTimer) {
			existingTimer.stop();
		}
		Timer.set(id, this);

		// Timers are automatically started and guaranteed to be running during
		// their lifespan.
		this._start();
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
		return Math.max(0.0, this._duration - ((new Date()).getTime() - this._startTime));
	}

	setDuration(duration, absolute) {
		clearTimeout(this._finishReference);
		this._duration = absolute ? duration : this.getDuration() + duration;
		this._startTime = (new Date()).getTime();
		this._finishReference = setTimeout(this._onFinish.bind(this), this._duration);
	}

	hasDevice() {
		return this._device instanceof Homey.Device;
	}

	getDevice() {
		return this.hasDevice() ? this._device : false;
	}

	stop() {
		clearTimeout(this._finishReference);
		this._finishReference = null;
		Timer.unset(this._id);

		if (this.hasDevice()) {
			let device = this.getDevice();
			device.setCapabilityValue('duration', NaN);
			device.setCapabilityValue('alarm_running', false);
		}

		Chronograph.log("Timer [" + this._name + "] stopped.");
	}

	destroy() {
		clearTimeout(this._finishReference);
		Timer.unset(this._id);

		Chronograph.log("Timer [" + this._name + "] destroyed.");
	}

	_start() {
		if (
			!Timer._updateReference
			&& this.hasDevice()
		) {
			Timer._updateReference = setTimeout(Timer._onUpdate, UPDATE_INTERVAL_MS);
		}

		this._startTime = (new Date()).getTime();
		this._finishReference = setTimeout(this._onFinish.bind(this), this._duration);

		if (this.hasDevice()) {
			let device = this.getDevice();
			device.setCapabilityValue('alarm_running', true);
			Chronograph.cards.timer_started.trigger(device, {
				// Tokens.
				"name": this._name,
				"seconds": this._duration / 1e3
			}, {
				// State.
				"timerId": this._id
			}, () => {
				// Callback.
			});
		} else {
			Chronograph.cards.timer_random_started.trigger({
				// Tokens.
				"name": this._name,
				"seconds": this._duration / 1e3
			}, {
				// State.
				"timerId": this._id
			}, () => {
				// Callback.
			});
		}

		Chronograph.log("Timer [" + this._name + "] started.");
	}

	_onFinish() {
		this._finishReference = null;
		Timer.unset(this._id);

		if (this.hasDevice()) {
			let device = this.getDevice();
			device.setCapabilityValue('duration', NaN);
			device.setCapabilityValue('alarm_running', false);

			Chronograph.cards.timer_finished.trigger(this._device, {
				// Tokens.
				"name": this._name
			}, {
				// State.
				"timerId": this._id
			}, () => {
				// Callback.
			});
		} else {
			Chronograph.cards.timer_random_finished.trigger({
				// Tokens.
				"name": this._name
			}, {
				// State.
				"timerId": this._id
			}, () => {
				// Callback.
			});
		}

		Chronograph.log("Timer [" + this._name + "] finished.");
	}

	static _onUpdate() {
		let continueUpdating = false;
		for (let id in Timer.timers) {
			let timer = Timer.get(id);
			if (timer.hasDevice()) {
				timer.getDevice().setCapabilityValue('duration', parseFloat((timer.getDuration() / 1e3).toFixed(1)));
				continueUpdating = true;
			}
		}

		if (continueUpdating) {
			Timer._updateReference = setTimeout(Timer._onUpdate, UPDATE_INTERVAL_MS);
		} else {
			Timer._updateReference = null;
		}
	}

	static get(id) {
		let timer = Timer.timers[id];
		if (!!timer) {
			return timer;
		} else {
			return false;
		}
	}

	static set(id, timer) {
		Timer.timers[id] = timer;
	}

	static unset(id) {
		delete(Timer.timers[id]);
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
