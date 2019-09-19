'use strict';

const { Utils } = require('./utils.js');
const { ExtendedEventEmitter } = require('./utils.js');

const ID_PREFIX = 'timer_';

class Timer {
	constructor(name, time, unit) {
		this._id = Timer.generateId(name);
		this._name = name;
		this._time = time;
		this._unit = unit;
		this._splits = [];
		this._paused = (new Date()).getTime();
		this._duration = Utils.calculateDuration(time, unit);

		let existingTimer = Timer._timers[this._id];
		if (!!existingTimer) {
			if (existingTimer.isRunning()) {
				existingTimer.stop(true);
			}
			Timer._timers[this._id] = this;
			Timer.events.emit('updated', this);
		} else {
			Timer._timers[this._id] = this;
			Timer.events.emit('created', this);
		}

		Timer.events.emit('log', this, "Timer created with duration of " + this.getDuration() + " ms.");
	}

	getId() {
		return this._id;
	}

	getName() {
		return this._name;
	}

	addSplit(time, unit) {
		if (!Timer._timers[this._id]) {
			throw new Error('timer already removed');
		}

		let wasRunning = this.isRunning();
		if (wasRunning) {
			this.pause(true);
		}

		let split = { time: time, unit: unit, passed: false };
		this._splits.push(split);

		if (wasRunning) {
			this.resume(true);
		}
	}

	isRunning() {
		return !this._paused && !!this._started && !!this._timeout;
	}

	getDuration() {
		if (this.isRunning()) {
			return Math.max(0.0, this._duration - ((new Date()).getTime() - this._started));
		} else {
			return this._duration;
		}
	}

	start(silent) {
		if (!Timer._timers[this._id]) {
			throw new Error('timer already removed');
		}
		if (this.isRunning()) {
			throw new Error('timer already running');
		}

		this._startNextTimeout();

		if (!silent) {
			Timer.events.emit('started', this);
		}
		Timer.events.emit('log', this, "Timer started with duration of " + this.getDuration() + " ms.");
	}

	adjust(time, unit, silent) {
		if (!Timer._timers[this._id]) {
			throw new Error('timer already removed');
		}

		let wasRunning = this.isRunning();
		if (wasRunning) {
			this.pause(true);
		}

		let adjust = Utils.calculateDuration(time, unit);
		this._duration = Math.max(0.0, this._duration + adjust);

		this._splits.forEach(split => split.passed = false);

		if (wasRunning) {
			this.resume(true);
		}
		if (!silent) {
			Timer.events.emit('updated', this);
		}
		Timer.events.emit('log', this, "Timer adjusted to duration of " + this.getDuration() + " ms.");
	}

	pause(silent) {
		if (!Timer._timers[this._id]) {
			throw new Error('timer already removed');
		}
		if (!this.isRunning()) {
			throw new Error('timer not running');
		}

		clearTimeout(this._timeout);
		this._timeout = null;
		this._paused = (new Date()).getTime();
		this._duration -= (this._paused - this._started);
		delete(this._started);

		if (!silent) {
			Timer.events.emit('paused', this);
		}
		Timer.events.emit('log', this, "Timer paused at duration " + this.getDuration() + " ms.");
	}

	resume(silent) {
		if (!Timer._timers[this._id]) {
			throw new Error('timer already removed');
		}
		if (this.isRunning()) {
			throw new Error('timer already running');
		}

		this._startNextTimeout();

		if (!silent) {
			Timer.events.emit('resumed', this);
		}
		Timer.events.emit('log', this, "Timer resumed with duration of " + this.getDuration() + " ms.");
	}

	stop(silent) {
		if (!Timer._timers[this._id]) {
			throw new Error('timer already removed');
		}

		if (!!this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
		this._paused = (new Date()).getTime();
		this._duration = 0;
		delete(this._started);

		delete(Timer._timers[this._id]);

		if (!silent) {
			Timer.events.emit('stopped', this);
			Timer.events.emit('removed', this);
		}
		Timer.events.emit('log', this, "Timer stopped.");
	}

	_getNextDelay() {
		let delays = this._splits.map(split => {
			let duration = this.getDuration() - Utils.calculateDuration(split.time, split.unit);
			split.passed = split.passed || duration < 0;
			return {
				type: 'split',
				duration: duration,
				split: split
			};
		}).filter(delay => !delay.split.passed);
		delays.push({ type: 'main', duration: this._duration });
		let intermediateDelay = Math.min(30000, delays[0].duration / 2);
		if (intermediateDelay > 300) {
			delays.push({ type: 'intermediate', duration: intermediateDelay });
		}
		delays.sort((a, b) => a.duration > b.duration ? 1 : -1);
		return delays[0];
	}

	_startNextTimeout() {
		let delay = this._getNextDelay();

		this._started = (new Date()).getTime();
		delete(this._paused);

		this._timeout = setTimeout(() => {
			this._paused = (new Date()).getTime();
			this._duration -= (this._paused - this._started);
			delete(this._started);

			switch(delay.type) {
				case 'split':
					delay.split.passed = true;
					Timer.events.emit('split', this, delay.split);
					Timer.events.emit('log', this, "Timer split on " + this.getDuration() + " ms.");
					this._startNextTimeout();
					break;
				case 'main':
					delete(this._timeout);
					this._duration = 0;

					delete(Timer._timers[this._id]);

					Timer.events.emit('finished', this);
					Timer.events.emit('removed', this);
					Timer.events.emit('log', this, "Timer finished.");
					break;
				case 'intermediate':
					this._startNextTimeout();
					break;
			}
		}, delay.duration);
	}

	static get(name) {
		let id = Timer.generateId(name);
		let timer = Timer._timers[id];
		if (!!timer) {
			return timer;
		} else {
			return false;
		}
	}

	static getById(id) {
		let timer = Timer._timers[id];
		if (!!timer) {
			return timer;
		} else {
			return false;
		}
	}

	static all() {
		let result = [];
		for (const id in Timer._timers) {
			result.push(Timer._timers[id]);
		}
		return result;
	}

	static generateId(name) {
		return Utils.generateId(ID_PREFIX, name);
	}
}

Timer.events = new ExtendedEventEmitter();
Timer._timers = {};

module.exports = Timer;
