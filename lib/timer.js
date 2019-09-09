'use strict';

const Homey = require('homey');
const Chronograph = require('./chronograph.js');

class Timer {
	constructor(id, name, time, unit) {
		this._id = id;
		this._name = name;
		this._time = time;
		this._unit = unit;
		this._duration = Chronograph.calculateDuration(time, unit);

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

	setDuration(time, unit, absolute) {
		clearTimeout(this._finishReference);
		let duration = Chronograph.calculateDuration(time, unit);
		this._duration = Math.max(0.0, absolute ? duration : this.getDuration() + duration);
		this._startTime = (new Date()).getTime();
		this._finishReference = setTimeout(this._onFinish.bind(this), this._duration);

		let splits = [];
		for (var index = 0; index < this._splits.length; index++) {
			clearTimeout(this._splits[index].reference);
			let delay = this._duration - this._splits[index].duration;
			if (delay > 0 ) {
				this._splits[index].reference = setTimeout(this._onSplit.bind(this, this._splits[index].time, this._splits[index].unit), delay);
				splits.push(this._splits[index]);
			} else {
				Chronograph.log("Timer split at " + this._splits[index].duration + " ms skipped.");
			}
		}
		this._splits = splits;

		Homey.ManagerApi.realtime('timer_updated', {
			id: this._id,
			name: this._name,
			duration: this.getDuration()
		});
	}

	stop() {
		clearTimeout(this._finishReference);
		this._finishReference = null;
		for (var index = 0; index < this._splits.length; index++) {
			clearTimeout(this._splits[index].reference);
			Chronograph.log("Timer split at " + this._splits[index].duration + " ms cancelled.");
		}
		this._splits = null;
		Timer.unset(this._id);

		Homey.ManagerApi.realtime('timer_removed', {
			id: this._id
		});

		Chronograph.log("Timer “" + this._name + "” stopped.");
	}

	destroy() {
		clearTimeout(this._finishReference);
		for (var index = 0; index < this._splits.length; index++) {
			clearTimeout(this._splits[index].reference);
		}
		Timer.unset(this._id);

		Homey.ManagerApi.realtime('timer_removed', {
			id: this._id
		});

		Chronograph.log("Timer “" + this._name + "” destroyed.");
	}

	_start() {
		this._startTime = (new Date()).getTime();
		this._finishReference = setTimeout(this._onFinish.bind(this), this._duration);
		this._splits = [];
		let splits = Homey.ManagerSettings.get('timer_splits');
		if (splits instanceof Array) {
			for (let index = 0; index < splits.length; index++) {
				if (splits[index].name == this._name) {
					let duration = Chronograph.calculateDuration(splits[index].time, splits[index].unit);
					let delay = this._duration - duration;
					if (delay > 0 ) {
						let splitReference = setTimeout(this._onSplit.bind(this, splits[index].time, splits[index].unit), delay);
						this._splits.push({
							duration: duration,
							reference: splitReference,
							time: splits[index].time,
							unit: splits[index].unit
						});
					}
				}
			}
		}

		Chronograph.cards.timer_started.trigger({
			// Tokens.
			"name": this._name,
			"time": this._time,
			"unit": Homey.__("unit_" + this._unit)
		}, {
			// State.
			"timerId": this._id
		}, () => {
			// Callback.
		});

		Homey.ManagerApi.realtime('timer_created', {
			id: this._id,
			name: this._name,
			duration: this.getDuration()
		});

		Chronograph.log("Timer “" + this._name + "” started with duration of " + this._duration + " ms.");
	}

	_onFinish() {
		this._finishReference = null;
		Timer.unset(this._id);

		Chronograph.cards.timer_finished.trigger({
			// Tokens.
			"name": this._name,
			"time": this._time,
			"unit": Homey.__("unit_" + this._unit)
		}, {
			// State.
			"timerId": this._id
		}, () => {
			// Callback.
		});

		Homey.ManagerApi.realtime('timer_removed', {
			id: this._id
		});

		Chronograph.log("Timer “" + this._name + "” finished.");
	}

	_onSplit(time, unit) {
		Chronograph.cards.timer_split.trigger({
			// Tokens.
			"name": this._name,
			"time": time,
			"unit": Homey.__("unit_" + unit)
		}, {
			// State.
			"timerId": this._id,
			"time": time,
			"unit": unit
		}, () => {
			// Callback.
		});

		let duration = Chronograph.calculateDuration(time, unit);
		Chronograph.log("Timer “" + this._name + "” split on " + duration + " ms.");
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
		let hash = 0, i, chr;
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
