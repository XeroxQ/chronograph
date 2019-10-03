'use strict';

const { Utils, ExtendedEventEmitter, LogLevel } = require('../utils.js');

const ID_PREFIX = 'transition_';

class Transition {
	constructor(name, time, unit, from, to, steps) {
		this._id = Transition.generateId(name);
		this._name = name;
		this._time = time;
		this._unit = unit;
		this._from = from;
		this._to = to;
		this._steps = steps;
		this._paused = (new Date()).getTime();
		this._duration = 0;

		let existingTransition = Transition._transitions[this._id];
		if (!!existingTransition) {
			if (existingTransition.isRunning()) {
				existingTransition.stop(true);
			}
			Transition._transitions[this._id] = this;
			Transition.events.emit('updated', this);
		} else {
			Transition._transitions[this._id] = this;
			Transition.events.emit('created', this);
		}

		Transition.events.emit('log', this, "Transition created with TODO.", LogLevel.INFO);
	}

	getId() {
		return this._id;
	}

	getName() {
		return this._name;
	}

	isRunning() {
		return !this._paused && !!this._started && !!this._timeout;
	}

	getDuration() {
		if (this.isRunning()) {
			return Math.max(0.0, this._duration + ((new Date()).getTime() - this._started));
		} else {
			return this._duration;
		}
	}

	start(silent) {
		if (!Transition._transitions[this._id]) {
			Transition.events.emit('log', this, "Transition not found.", LogLevel.ERROR);
			return;
		}
		if (this.isRunning()) {
			Transition.events.emit('log', this, "Transition not running.", LogLevel.WARNING);
			return;
		}

		this._startNextTimeout();

		if (!silent) {
			Transition.events.emit('started', this);
		}
		Transition.events.emit('log', this, "Transition started with TODO.", LogLevel.INFO);
	}

	adjust(time, unit, silent) {
		if (!Transition._transitions[this._id]) {
			Transition.events.emit('log', this, "Transition not found.", LogLevel.ERROR);
			return;
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
			Transition.events.emit('updated', this);
		}
		Transition.events.emit('log', this, "Transition adjusted to duration of " + this.getDuration() + " ms.", LogLevel.INFO);
	}

	pause(silent) {
		if (!Transition._transitions[this._id]) {
			Transition.events.emit('log', this, "Transition not found.", LogLevel.ERROR);
			return;
		}
		if (!this.isRunning()) {
			Transition.events.emit('log', this, "Transition not running.", LogLevel.WARNING);
			return;
		}

		clearTimeout(this._timeout);
		this._timeout = null;
		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		if (!silent) {
			Transition.events.emit('paused', this);
		}
		Transition.events.emit('log', this, "Transition paused at duration " + this.getDuration() + " ms.", LogLevel.INFO);
	}

	resume(silent) {
		if (!Transition._transitions[this._id]) {
			Transition.events.emit('log', this, "Transition not found.", LogLevel.ERROR);
			return;
		}
		if (this.isRunning()) {
			Transition.events.emit('log', this, "Transition not running.", LogLevel.WARNING);
			return;
		}

		this._startNextTimeout();

		if (!silent) {
			Transition.events.emit('resumed', this);
		}
		Transition.events.emit('log', this, "Transition resumed with duration of " + this.getDuration() + " ms.", LogLevel.INFO);
	}

	stop(silent) {
		if (!Transition._transitions[this._id]) {
			Transition.events.emit('log', this, "Transition not found.", LogLevel.ERROR);
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

		delete(Transition._transitions[this._id]);

		if (!silent) {
			Transition.events.emit('stopped', this);
			Transition.events.emit('removed', this);
		}
		Transition.events.emit('log', this, "Transition stopped.", LogLevel.INFO);
	}

	_getNextDelay() {
		/*
		let delays = this._splits.map(split => {
			let duration = this.getDuration() - Utils.calculateDuration(split.time, split.unit);
			split.passed = split.passed || duration < 0;
			return {
				type: 'split',
				duration: duration,
				split: split
			};
		}).filter(delay => !delay.split.passed);
		*/


//console.log(Utils.calculateDuration(this._time, this._unit));
//console.log(this.getDuration());

		let delays = [];
		delays.push({ type: 'main', duration: Utils.calculateDuration(this._time, this._unit) - this.getDuration() });
		let intermediateDelay = Math.min(30000, delays[0].duration / 2);
		if (intermediateDelay > 300) {
			delays.push({ type: 'intermediate', duration: intermediateDelay });
		}
		delays.sort((a, b) => a.duration > b.duration ? 1 : -1);


//console.log(delays);

		return delays[0];
	}

	_startNextTimeout() {
		let delay = this._getNextDelay();

		this._started = (new Date()).getTime();
		delete(this._paused);

		this._timeout = setTimeout(this._onTimeout.bind(this, delay), delay.duration);
	}

	_onTimeout(delay) {
		this._paused = (new Date()).getTime();
		this._duration += (this._paused - this._started);
		delete(this._started);

		switch(delay.type) {
			/*
			case 'split':
				delay.split.passed = true;
				Timer.events.emit('split', this, delay.split);
				Timer.events.emit('log', this, "Timer split on " + this.getDuration() + " ms.", LogLevel.INFO);
				this._startNextTimeout();
				break;
			*/
			case 'main':
				delete(this._timeout);
				this._duration = Utils.calculateDuration(this._time, this._unit);

				delete(Transition._transitions[this._id]);

				Transition.events.emit('finished', this);
				Transition.events.emit('removed', this);
				Transition.events.emit('log', this, "Transition finished.", LogLevel.INFO);
				break;
			case 'intermediate':
				this._startNextTimeout();
				break;
		}
	}

	static get(name) {
		let id = Transition.generateId(name);
		let transition = Transition._transitions[id];
		if (!!transition) {
			return transition;
		} else {
			return false;
		}
	}

	static getById(id) {
		let transition = Transition._transitions[id];
		if (!!transition) {
			return transition;
		} else {
			return false;
		}
	}

	static all() {
		let result = [];
		for (const id in Transition._transitions) {
			result.push(Transition._transitions[id]);
		}
		return result;
	}

	static generateId(name) {
		return Utils.generateId(ID_PREFIX, name);
	}
}

Transition.events = new ExtendedEventEmitter();
Transition._transitions = {};

module.exports = Transition;
