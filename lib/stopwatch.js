'use strict';

const Homey = require('homey');
const Chronograph = require('./chronograph.js');

const UPDATE_INTERVAL_MS = 250;

class Stopwatch {
	constructor(id, name, device) {
		this._id = id;
		this._name = name;
		this._device = device;

		// If there's already a stopwatch running, stop it first.
		let existingStopwatch = Stopwatch.get(id);
		if (!!existingStopwatch) {
			existingStopwatch.stop();
		}
		Stopwatch.set(id, this);

		// Stopwatches are automatically started and guaranteed to be running during
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
		return Math.max(0.0, (new Date()).getTime() - this._startTime);
	}

	setDuration(duration, absolute) {
		this._startTime = absolute ? (new Date()).getTime() - duration : this._startTime + (-duration);
	}

	hasDevice() {
		return this._device instanceof Homey.Device;
	}

	getDevice() {
		return this.hasDevice() ? this._device : false;
	}

	stop(deleted) {
		for (var index = 0; index < this._splitReferences.length; index++) {
			clearTimeout(this._splitReferences[index]);
		}
		this._splitReferences = null;
		Stopwatch.unset(this._id);

		if (this.hasDevice()) {
			let device = this.getDevice();
			device.setCapabilityValue('duration', NaN);
			device.setCapabilityValue('alarm_running', false);
			device.setCapabilityValue('onoff.0', false);
		}

		Chronograph.log("Stopwatch [" + this._name + "] stopped.");
	}

	destroy() {
		for (var index = 0; index < this._splitReferences.length; index++) {
			clearTimeout(this._splitReferences[index]);
		}
		Stopwatch.unset(this._id);

		Chronograph.log("Stopwatch [" + this._name + "] destroyed.");
	}

	_start() {
		if (
			!Stopwatch._updateReference
			&& this.hasDevice()
		) {
			Stopwatch._updateReference = setTimeout(Stopwatch._onUpdate, UPDATE_INTERVAL_MS);
		}

		this._startTime = (new Date()).getTime();
		this._splitReferences = [];
		let splits = Homey.ManagerSettings.get('stopwatch_splits');
		for (let index = 0; index < splits.length; index++) {
			if (splits[index].name == this._name) {
				this._splitReferences.push(setTimeout(this._onSplit.bind(this, splits[index].seconds), splits[index].seconds * 1e3));
			}
		}

		if (this.hasDevice()) {
			let device = this.getDevice();
			device.setCapabilityValue('alarm_running', true);
			device.setCapabilityValue('onoff.0', true);
			Chronograph.cards.stopwatch_started.trigger(device, {
				// Tokens.
				"name": this._name
			}, {
				// State.
				"stopwatchId": this._id
			}, () => {
				// Callback.
			});
		} else {
			Chronograph.cards.stopwatch_random_started.trigger({
				// Tokens.
				"name": this._name
			}, {
				// State.
				"stopwatchId": this._id
			}, () => {
				// Callback.
			});
		}

		Chronograph.log("Stopwatch [" + this._name + "] started.");
	}

	_onSplit(duration) {
		Chronograph.cards.stopwatch_random_split.trigger({
			// Tokens.
			"name": this._name
		}, {
			// State.
			"stopwatchId": this._id,
			"duration": duration
		}, () => {
			// Callback.
		});

		Chronograph.log("Stopwatch [" + this._name + "] split.");
	}

	static _onUpdate() {
		let continueUpdating = false;
		for (let id in Stopwatch.stopwatches) {
			let stopwatch = Stopwatch.get(id);
			if (stopwatch.hasDevice()) {
				stopwatch.getDevice().setCapabilityValue('duration', parseFloat((stopwatch.getDuration() / 1e3).toFixed(1)));
				continueUpdating = true;
			}
		}

		if (continueUpdating) {
			Stopwatch._updateReference = setTimeout(Stopwatch._onUpdate, UPDATE_INTERVAL_MS);
		} else {
			Stopwatch._updateReference = null;
		}
	}

	static get(id) {
		let stopwatch = Stopwatch.stopwatches[id];
		if (!!stopwatch) {
			return stopwatch;
		} else {
			return false;
		}
	}

	static set(id, stopwatch) {
		Stopwatch.stopwatches[id] = stopwatch;
	}

	static unset(id) {
		delete(Stopwatch.stopwatches[id]);
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
