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

		this._started = (new Date()).getTime();
		delete(this._paused);

		this._splits.forEach((split, index) => {
			this._startSplit(split);
		});

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

		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		this._splits.forEach((split) => {
			clearTimeout(split.timeout);
			delete(split.timeout);
		});

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

		this._started = (new Date()).getTime();
		delete(this._paused);

		this._splits.forEach((split, index) => {
			this._startSplit(split);
		});

		if (!silent) {
			Stopwatch.events.emit('resumed', this);
		}
		Stopwatch.events.emit('log', this, "Stopwatch resumed at duration " + this.getDuration() + " ms.");
	}

	stop(silent) {
		if (!Stopwatch._stopwatches[this._id]) {
			throw new Error('stopwatch already removed');
		}

		this._paused = (new Date()).getTime();
		if (!!this._started) {
			this._duration += (this._paused - this._started);
		}
		delete(this._started);

		this._splits.forEach((split) => {
			clearTimeout(split.timeout);
			delete(split.timeout);
		});

		delete(Stopwatch._stopwatches[this._id]);
		
		if (!silent) {
			Stopwatch.events.emit('stopped', this);
			Stopwatch.events.emit('removed', this);
		}
		Stopwatch.events.emit('log', this, "Stopwatch stopped at duration " + this.getDuration() + " ms.");
	}

	_startSplit(split) {
		let duration = Utils.calculateDuration(split.time, split.unit);
		let delay = duration - this.getDuration();
		if (delay > 0 ) {
			split.timeout = setTimeout(() => {
				Stopwatch.events.emit('split', this, split);
				Stopwatch.events.emit('log', this, "Stopwatch split at " + this.getDuration() + " ms.");
			}, delay);
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
