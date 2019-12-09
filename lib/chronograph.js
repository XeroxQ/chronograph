const Data = require('./data.js');
const { Utils, ExtendedEventEmitter, LogLevel } = require('./utils.js');

class Chronograph extends Data {
	constructor(id, name, time = NaN, unit = 'seconds') {
		super();

		this._id = id;
		this._name = name;
		this._time = time;
		this._unit = unit;
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
	}

	getId() {
		return this._id;
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

		this._started = (new Date()).getTime();
		delete(this._paused);

		if (!silent) {
			Chronograph.events.emit('started', this);
		}
		if (isNaN(this._time)) {
			Chronograph.events.emit('log', this, "Chronograph started.", LogLevel.INFO);
		} else {
			Chronograph.events.emit('log', this, "Chronograph started with duration " + this.getTargetDuration() + " ms.", LogLevel.INFO);
		}

		Chronograph._resetNextTimeout();
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

		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		if (!silent) {
			Chronograph.events.emit('paused', this);
		}
		Chronograph.events.emit('log', this, "Chronograph paused at duration " + this.getDuration() + " ms.", LogLevel.INFO);

		Chronograph._resetNextTimeout();
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

		this._started = (new Date()).getTime();
		delete(this._paused);

		if (!silent) {
			Chronograph.events.emit('resumed', this);
		}
		Chronograph.events.emit('log', this, "Chronograph resumed.", LogLevel.INFO);

		Chronograph._resetNextTimeout();
	}

	stop(silent) {
		if (!Chronograph._chronographs[this._id]) {
			Chronograph.events.emit('log', this, "Chronograph not found.", LogLevel.ERROR);
			return;
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

		Chronograph._resetNextTimeout();
	}

	_onTimeout(delay) {
		switch(delay.type) {
			case 'split':
				delay.split.passed = true;
				Chronograph.events.emit('split', this, delay.split);
				Chronograph.events.emit('log', this, "Chronograph split on " + this.getDuration() + " ms.", LogLevel.INFO);
				break;
			case 'main':
				this._paused = (new Date()).getTime();
				this._duration = Utils.calculateDuration(this._time, this._unit);
				delete(this._started);

				delete(Chronograph._chronographs[this._id]);

				Chronograph.events.emit('finished', this);
				Chronograph.events.emit('removed', this);
				Chronograph.events.emit('log', this, "Chronograph finished.", LogLevel.INFO);
				break;
		}

		Chronograph._resetNextTimeout();
	}

	static get(id) {
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

	static _resetNextTimeout() {
		if (Chronograph._timeout) {
			clearTimeout(Chronograph._timeout);
			Chronograph._timeout = null;
		}

		// Only work with running chronographs.
		let chronographs = Chronograph
			.all()
			.filter(chronograph => chronograph.isRunning());

		// First the main delays are added to the delays array.
		let delays = [];
		delays.push.apply(
			delays,
			chronographs
				.filter(chronograph => !isNaN(chronograph._time))
				.map(chronograph => ({
					type: 'main',
					chronograph: chronograph,
					duration: Utils.calculateDuration(chronograph._time, chronograph._unit) - chronograph.getDuration()
				})));

		// Then the splits are added.
		delays.push.apply(
			delays,
			chronographs.reduce((accumulator, chronograph) => {
				accumulator.push.apply(
					accumulator,
					chronograph._splits
						.map(split => {
							let duration = Utils.calculateDuration(split.time, split.unit) - chronograph.getDuration();
							split.passed = split.passed || duration < 0;
							return {
								type: 'split',
								chronograph: chronograph,
								duration: duration,
								split: split
							};
						})
						.filter(delay => !delay.split.passed));
				return accumulator;
			}, []));

		// If there are no delays we're not having to set a timeout.
		if (delays.length == 0) {
			return;
		}

		// Sort the delays starting with the shortest first.
		delays.sort((a, b) => a.duration > b.duration ? 1 : -1);

		// The delays are split into smaller, more accurate delays.
		let intermediateDelay = Math.min(30000, delays[0].duration / 2);
		if (intermediateDelay > 300) {
			Chronograph._timeout = setTimeout(Chronograph._resetNextTimeout, intermediateDelay);
		} else {
			Chronograph._timeout = setTimeout(delays[0].chronograph._onTimeout.bind(delays[0].chronograph, delays[0]), delays[0].duration);
		}
	}
}

Chronograph.events = new ExtendedEventEmitter();
Chronograph._chronographs = {};
Chronograph._timeout = null;

module.exports = Chronograph;
