'use strict';

const Homey = require('homey');
const Chronograph = require('./chronograph.js');

class Stopwatch {
	constructor(id, name) {
		this._id = id;
		this._name = name;

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

	setDuration(time, unit, absolute) {
		let duration = Chronograph.calculateDuration(time, unit);
		this._startTime = absolute ? (new Date()).getTime() - duration : this._startTime + (-duration);

		let splits = [];
		for (var index = 0; index < this._splits.length; index++) {
			clearTimeout(this._splits[index].reference);
			let delay = this._startTime + this._splits[index].duration - (new Date()).getTime();
			if (delay > 0 ) {
				this._splits[index].reference = setTimeout(this._onSplit.bind(this, this._splits[index].time, this._splits[index].unit), delay);
				splits.push(this._splits[index]);
			} else {
				Chronograph.log("Stopwatch split at " + this._splits[index].duration + " ms skipped.");
			}
		}
		this._splits = splits;

		Homey.ManagerApi.realtime('stopwatch_updated', {
			id: this._id,
			name: this._name,
			duration: this.getDuration()
		});
	}

	stop() {
		for (var index = 0; index < this._splits.length; index++) {
			clearTimeout(this._splits[index].reference);
			Chronograph.log("Stopwatch split at " + this._splits[index].duration + " ms cancelled.");
		}
		this._splits = null;
		Stopwatch.unset(this._id);

		Homey.ManagerApi.realtime('stopwatch_removed', {
			id: this._id
		});

		Chronograph.log("Stopwatch “" + this._name + "” stopped.");
	}

	destroy() {
		for (var index = 0; index < this._splits.length; index++) {
			clearTimeout(this._splits[index].reference);
		}
		Stopwatch.unset(this._id);

		Homey.ManagerApi.realtime('stopwatch_removed', {
			id: this._id
		});

		Chronograph.log("Stopwatch “" + this._name + "” destroyed.");
	}

	_start() {
		this._startTime = (new Date()).getTime();
		this._splits = [];
		let splits = Homey.ManagerSettings.get('stopwatch_splits');
		if (splits instanceof Array) {
			for (let index = 0; index < splits.length; index++) {
				if (splits[index].name == this._name) {
					let duration = Chronograph.calculateDuration(splits[index].time, splits[index].unit);
					let splitReference = setTimeout(this._onSplit.bind(this, splits[index].time, splits[index].unit), duration);
					this._splits.push({
						duration: duration,
						reference: splitReference,
						time: splits[index].time,
						unit: splits[index].unit
					});
				}
			}
		}

		Chronograph.cards.stopwatch_started.trigger({
			// Tokens.
			"name": this._name
		}, {
			// State.
			"stopwatchId": this._id
		}, () => {
			// Callback.
		});

		Homey.ManagerApi.realtime('stopwatch_created', {
			id: this._id,
			name: this._name,
			duration: this.getDuration()
		});

		Chronograph.log("Stopwatch “" + this._name + "” started.");
	}

	_onSplit(time, unit) {
		Chronograph.cards.stopwatch_split.trigger({
			// Tokens.
			"name": this._name,
			"time": time,
			"unit": Homey.__("unit_" + unit)
		}, {
			// State.
			"stopwatchId": this._id,
			"time": time,
			"unit": unit
		}, () => {
			// Callback.
		});

		let duration = Chronograph.calculateDuration(time, unit);
		Chronograph.log("Stopwatch “" + this._name + "” split on " + duration + " seconds.");
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
		let hash = 0, i, chr;
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
