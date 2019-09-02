'use strict';

const Homey = require('homey');
const Chronograph = require('./chronograph.js');

class Timer {
	constructor(id, name, duration) {
		this._id = id;
		this._name = name;
		this._duration = duration;

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

	stop() {
		clearTimeout(this._finishReference);
		this._finishReference = null;
		for (var index = 0; index < this._splitReferences.length; index++) {
			clearTimeout(this._splitReferences[index]);
		}
		this._splitReferences = null;
		Timer.unset(this._id);

		Chronograph.log("Timer “" + this._name + "” stopped.");
	}

	destroy() {
		clearTimeout(this._finishReference);
		for (var index = 0; index < this._splitReferences.length; index++) {
			clearTimeout(this._splitReferences[index]);
		}
		Timer.unset(this._id);

		Chronograph.log("Timer “" + this._name + "” destroyed.");
	}

	_start() {
		this._startTime = (new Date()).getTime();
		this._finishReference = setTimeout(this._onFinish.bind(this), this._duration);
		this._splitReferences = [];
		let splits = Homey.ManagerSettings.get('timer_splits');
		if (splits instanceof Array) {
			for (let index = 0; index < splits.length; index++) {
				if (splits[index].name == this._name) {
					let delay = this._duration - (splits[index].seconds * 1e3);
					if (delay > 0 ) {
						this._splitReferences.push(setTimeout(this._onSplit.bind(this, splits[index].seconds), delay));
					}
				}
			}
		}

		Chronograph.cards.timer_started.trigger({
			// Tokens.
			"name": this._name,
			"seconds": this._duration / 1e3
		}, {
			// State.
			"timerId": this._id
		}, () => {
			// Callback.
		});

		Chronograph.log("Timer “" + this._name + "” started.");
	}

	_onFinish() {
		this._finishReference = null;
		Timer.unset(this._id);

		Chronograph.cards.timer_finished.trigger({
			// Tokens.
			"name": this._name,
			"seconds": this._duration / 1e3
		}, {
			// State.
			"timerId": this._id
		}, () => {
			// Callback.
		});

		Chronograph.log("Timer “" + this._name + "” finished.");
	}

	_onSplit(duration) {
		Chronograph.cards.timer_split.trigger({
			// Tokens.
			"name": this._name,
			"seconds": duration
		}, {
			// State.
			"timerId": this._id,
			"seconds": duration
		}, () => {
			// Callback.
		});

		Chronograph.log("Timer “" + this._name + "” split.");
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
