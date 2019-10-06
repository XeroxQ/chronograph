const Data = require('./data.js');
const { Utils, ExtendedEventEmitter, LogLevel } = require('./utils.js');

class Chronograph extends Data {
	constructor(prefix, name, time, unit) {
		super();

		this._id = Chronograph.generateId(prefix, name);
		this._prefix = prefix;
		this._name = name;
		this._time = typeof time == 'undefined' ? NaN : time;
		this._unit = typeof unit == 'undefined' ? 'seconds' : unit;
		this._splits = [];
		this._paused = (new Date()).getTime();
		this._duration = 0;

		let existingChronograph = Chronograph._chronographs[this._id];
		if (!!existingChronograph) {
			if (existingChronograph.isRunning()) {
				existingChronograph.stop(true);
			}
			Chronograph._chronographs[this._id] = this;
			Chronograph.events.emit('updated', this);
		} else {
			Chronograph._chronographs[this._id] = this;
			Chronograph.events.emit('created', this);
		}

		if (isNaN(this._time)) {
			Chronograph.events.emit('log', this, "Chronograph created.", LogLevel.INFO);
		} else {
			Chronograph.events.emit('log', this, "Chronograph created with duration " + Utils.calculateDuration(time, unit) + " ms.", LogLevel.INFO);
		}
	}

	getId() {
		return this._id;
	}

	getPrefix() {
		return this._prefix;
	}

	getName() {
		return this._name;
	}

	addSplit(time, unit, data) {
		if (!Chronograph._chronographs[this._id]) {
			Chronograph.events.emit('log', this, "Chronograph not found.", LogLevel.ERROR);
			return;
		}

		let wasRunning = this.isRunning();
		if (wasRunning) {
			this.pause(true);
		}

		let split = { time: time, unit: unit, data: data, passed: false };
		this._splits.push(split);

		if (wasRunning) {
			this.resume(true);
		}

		Chronograph.events.emit('log', this, "Chronograph split added at " + Utils.calculateDuration(time, unit) + " ms.", LogLevel.INFO);
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

	getTargetDuration() {
		if (!isNaN(this._time)) {
			return Utils.calculateDuration(this._time, this._unit);
		} else {
			return NaN;
		}
	}

	start(silent) {
		if (!Chronograph._chronographs[this._id]) {
			Chronograph.events.emit('log', this, "Chronograph not found.", LogLevel.ERROR);
			return;
		}
		if (this.isRunning()) {
			Chronograph.events.emit('log', this, "Chronograph already running.", LogLevel.WARNING);
			return;
		}

		this._startNextTimeout();

		if (!silent) {
			Chronograph.events.emit('started', this);
		}
		Chronograph.events.emit('log', this, "Chronograph started.", LogLevel.INFO);
	}

	adjust(time, unit, silent) {
		if (!Chronograph._chronographs[this._id]) {
			Chronograph.events.emit('log', this, "Chronograph not found.", LogLevel.ERROR);
			return;
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
			Chronograph.events.emit('updated', this);
		}
		Chronograph.events.emit('log', this, "Chronograph adjusted to duration of " + this.getDuration() + " ms.", LogLevel.INFO);
	}

	pause(silent) {
		if (!Chronograph._chronographs[this._id]) {
			Chronograph.events.emit('log', this, "Chronograph not found.", LogLevel.ERROR);
			return;
		}
		if (!this.isRunning()) {
			Chronograph.events.emit('log', this, "Chronograph not running.", LogLevel.WARNING);
			return;
		}

		clearTimeout(this._timeout);
		this._timeout = null;
		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		if (!silent) {
			Chronograph.events.emit('paused', this);
		}
		Chronograph.events.emit('log', this, "Chronograph paused at duration " + this.getDuration() + " ms.", LogLevel.INFO);
	}

	resume(silent) {
		if (!Chronograph._chronographs[this._id]) {
			Chronograph.events.emit('log', this, "Chronograph not found.", LogLevel.ERROR);
			return;
		}
		if (this.isRunning()) {
			Chronograph.events.emit('log', this, "Chronograph already running.", LogLevel.WARNING);
			return;
		}

		this._startNextTimeout();

		if (!silent) {
			Chronograph.events.emit('resumed', this);
		}
		Chronograph.events.emit('log', this, "Chronograph resumed.", LogLevel.INFO);
	}

	stop(silent) {
		if (!Chronograph._chronographs[this._id]) {
			Chronograph.events.emit('log', this, "Chronograph not found.", LogLevel.ERROR);
			return;
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

		delete(Chronograph._chronographs[this._id]);

		if (!silent) {
			Chronograph.events.emit('stopped', this);
			Chronograph.events.emit('removed', this);
		}
		Chronograph.events.emit('log', this, "Chronograph stopped.", LogLevel.INFO);
	}

	_getNextDelay() {
		// First the splits are added to the array of next delays.
		let delays = this._splits.map(split => {
			let duration = Utils.calculateDuration(split.time, split.unit) - this.getDuration();
			split.passed = split.passed || duration < 0;
			return {
				type: 'split',
				duration: duration,
				split: split
			};
		}).filter(delay => !delay.split.passed);

		// Then the main delay is added, if an end time was provided.
		if (!isNaN(this._time)) {
			delays.push({ type: 'main', duration: Utils.calculateDuration(this._time, this._unit) - this.getDuration() });
		}

		// Instead of waiting a potentially long time, the delays are split into
		// smaller, more accurate sections.
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

		this._timeout = setTimeout(this._onTimeout.bind(this, delay), delay.duration);
	}

	_onTimeout(delay) {
		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		switch(delay.type) {
			case 'split':
				delay.split.passed = true;
				Chronograph.events.emit('split', this, delay.split);
				Chronograph.events.emit('log', this, "Chronograph split on " + this.getDuration() + " ms.", LogLevel.INFO);
				this._startNextTimeout();
				break;
			case 'main':
				delete(this._timeout);
				this._duration = Utils.calculateDuration(this._time, this._unit);

				delete(Chronograph._chronographs[this._id]);

				Chronograph.events.emit('finished', this);
				Chronograph.events.emit('removed', this);
				Chronograph.events.emit('log', this, "Chronograph finished.", LogLevel.INFO);
				break;
			case 'intermediate':
				this._startNextTimeout();
				break;
		}
	}

	static get(prefix, name) {
		let id = Chronograph.generateId(prefix, name);
		let chronograph = Chronograph._chronographs[id];
		if (!!chronograph) {
			return chronograph;
		} else {
			return false;
		}
	}

	static getById(id) {
		let chronograph = Chronograph._chronographs[id];
		if (!!chronograph) {
			return chronograph;
		} else {
			return false;
		}
	}

	static all() {
		let result = [];
		for (const id in Chronograph._chronographs) {
			result.push(Chronograph._chronographs[id]);
		}
		return result;
	}

	static generateId(prefix, name) {
		return Utils.generateId(prefix, name);
	}
}

Chronograph.events = new ExtendedEventEmitter();
Chronograph._chronographs = {};

module.exports = Chronograph;
