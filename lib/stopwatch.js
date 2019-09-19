'use strict';

const { Utils } = require('./utils.js');
const { ExtendedEventEmitter } = require('./utils.js');

const ID_PREFIX = 'stopwatch_';

class Stopwatch {
	constructor(name) {
		this._id = Stopwatch.generateId(name);
		this._name = name;
		this._splits = [];
		this._paused = (new Date()).getTime();
		this._duration = 0;

		let existingStopwatch = Stopwatch._stopwatches[this._id];
		if (!!existingStopwatch) {
			if (existingStopwatch.isRunning()) {
				existingStopwatch.stop(true);
			}
			Stopwatch._stopwatches[this._id] = this;
			Stopwatch.events.emit('updated', this);
		} else {
			Stopwatch._stopwatches[this._id] = this;
			Stopwatch.events.emit('created', this);
		}

		Stopwatch.events.emit('log', this, "Stopwatch created.");
	}

	getId() {
		return this._id;
	}

	getName() {
		return this._name;
	}

	addSplit(time, unit) {
		if (!Stopwatch._stopwatches[this._id]) {
			throw new Error('stopwatch already removed');
		}

		let wasRunning = this.isRunning();
		if (wasRunning) {
			this.pause(true);
		}

		let split = { time: time, unit: unit };
		this._splits.push(split);

		if (wasRunning) {
			this.resume(true);
		}
	}

	isRunning() {
		return !this._paused && !!this._started;
	}

	getDuration() {
		if (this.isRunning()) {
			return Math.max(0.0, this._duration + ((new Date()).getTime() - this._started));
		} else {
			return this._duration;
		}
	}

	start(silent) {
		if (!Stopwatch._stopwatches[this._id]) {
			throw new Error('stopwatch already removed');
		}
		if (this.isRunning()) {
			throw new Error('stopwatch already running');
		}

		this._startNextTimeout();

		if (!silent) {
			Stopwatch.events.emit('started', this);
		}
		Stopwatch.events.emit('log', this, "Stopwatch started.");
	}

	adjust(time, unit, silent) {
		if (!Stopwatch._stopwatches[this._id]) {
			throw new Error('stopwatch already removed');
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
			Stopwatch.events.emit('updated', this);
		}
		Stopwatch.events.emit('log', this, "Stopwatch adjusted to duration of " + this.getDuration() + " ms.");
	}

	pause(silent) {
		if (!Stopwatch._stopwatches[this._id]) {
			throw new Error('stopwatch already removed');
		}
		if (!this.isRunning()) {
			throw new Error('stopwatch not running');
		}

		clearTimeout(this._timeout);
		this._timeout = null;
		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		if (!silent) {
			Stopwatch.events.emit('paused', this);
		}
		Stopwatch.events.emit('log', this, "Stopwatch paused at duration " + this.getDuration() + " ms.");
	}

	resume(silent) {
		if (!Stopwatch._stopwatches[this._id]) {
			throw new Error('stopwatch already removed');
		}
		if (this.isRunning()) {
			throw new Error('stopwatch already running');
		}

		this._startNextTimeout();

		if (!silent) {
			Stopwatch.events.emit('resumed', this);
		}
		Stopwatch.events.emit('log', this, "Stopwatch resumed at duration " + this.getDuration() + " ms.");
	}

	stop(silent) {
		if (!Stopwatch._stopwatches[this._id]) {
			throw new Error('stopwatch already removed');
		}

		if (!!this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
		this._paused = (new Date()).getTime();
		if (!!this._started) {
			this._duration += (this._paused - this._started);
		}
		delete(this._started);

		delete(Stopwatch._stopwatches[this._id]);
		
		if (!silent) {
			Stopwatch.events.emit('stopped', this);
			Stopwatch.events.emit('removed', this);
		}
		Stopwatch.events.emit('log', this, "Stopwatch stopped at duration " + this.getDuration() + " ms.");
	}

	_getNextDelay() {
		let delays = this._splits.map(split => {
			let duration = Utils.calculateDuration(split.time, split.unit) - this.getDuration();
			split.passed = split.passed || duration < 0;
			return {
				type: 'split',
				duration: duration,
				split: split
			};
		}).filter(delay => !delay.split.passed);
		if (delays.length > 0) {
			let intermediateDelay = Math.min(30000, delays[0].duration / 2);
			if (intermediateDelay > 300) {
				delays.push({ type: 'intermediate', duration: intermediateDelay });
			}
			delays.sort((a, b) => a.duration > b.duration ? 1 : -1);
			return delays[0];
		}
		return false;
	}

	_startNextTimeout() {
		let delay = this._getNextDelay();

		this._started = (new Date()).getTime();
		delete(this._paused);

		if (!delay) {
			return;
		}

		this._timeout = setTimeout(this._onTimeout.bind(this), delay.duration);
	}

	_onTimeout() {
		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		switch(delay.type) {
			case 'split':
				delay.split.passed = true;
				Stopwatch.events.emit('split', this, delay.split);
				Stopwatch.events.emit('log', this, "Stopwatch split at " + this.getDuration() + " ms.");
				this._startNextTimeout();
				break;
			case 'intermediate':
				this._startNextTimeout();
				break;
		}
	}

	static get(name) {
		let id = Stopwatch.generateId(name);
		let stopwatch = Stopwatch._stopwatches[id];
		if (!!stopwatch) {
			return stopwatch;
		} else {
			return false;
		}
	}

	static getById(id) {
		let stopwatch = Stopwatch._stopwatches[id];
		if (!!stopwatch) {
			return stopwatch;
		} else {
			return false;
		}
	}

	static all() {
		let result = [];
		for (const id in Stopwatch._stopwatches) {
			result.push(Stopwatch._stopwatches[id]);
		}
		return result;
	}

	static generateId(name) {
		return Utils.generateId(ID_PREFIX, name);
	}
}

Stopwatch.events = new ExtendedEventEmitter();
Stopwatch._stopwatches = {};

module.exports = Stopwatch;
