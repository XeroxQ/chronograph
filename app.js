'use strict';

const Homey = require('homey');
const Timer = require('./lib/timer.js');
const Stopwatch = require('./lib/stopwatch.js');

// Actions.
const TimerStart = require('./lib/actions/timer_start.js');
const TimerResume = require('./lib/actions/timer_resume.js');
const TimerAdjust = require('./lib/actions/timer_adjust.js');
const TimerPause = require('./lib/actions/timer_pause.js');
const TimerStop = require('./lib/actions/timer_stop.js');
const TimerStopAll = require('./lib/actions/timer_stop_all.js');
const StopwatchStart = require('./lib/actions/stopwatch_start.js');
const StopwatchResume = require('./lib/actions/stopwatch_resume.js');
const StopwatchAdjust = require('./lib/actions/stopwatch_adjust.js');
const StopwatchPause = require('./lib/actions/stopwatch_pause.js');
const StopwatchStop = require('./lib/actions/stopwatch_stop.js');
const StopwatchStopAll = require('./lib/actions/stopwatch_stop_all.js');

// Conditions.
const TimerCompare = require('./lib/conditions/timer_compare.js');
const TimerRunning = require('./lib/conditions/timer_running.js');
const StopwatchCompare = require('./lib/conditions/stopwatch_compare.js');
const StopwatchRunning = require('./lib/conditions/stopwatch_running.js');

// Triggers.
const TimerStarted = require('./lib/triggers/timer_started.js');
const TimerSplit = require('./lib/triggers/timer_split.js');
const TimerFinished = require('./lib/triggers/timer_finished.js');
const TimerStopped = require('./lib/triggers/timer_stopped.js');
const StopwatchStarted = require('./lib/triggers/stopwatch_started.js');
const StopwatchSplit = require('./lib/triggers/stopwatch_split.js');
const StopwatchStopped = require('./lib/triggers/stopwatch_stopped.js');


class Application extends Homey.App {
	onInit() {
		// Initializing cards.
		this.log('Initializing cards.');
		this._initializeCards();

		// Listen for log events.
		this._installLogEventHandlers();

		// Listen for events that need to be passed on to the settings page.
		this.log('Installing event handlers.');
		this._installTimerEventHandlers();
		this._installStopwatchEventHandlers();

		// Restore timers and stopwatches from settings.
		this.log('Restoring timers and stopwatches.');
		this._restoreTimers();
		this._restoreStopwatches();

		this.log('Application is running.');
	}

	_initializeCards() {
		this._cards = {
			// Actions.
			"timer_start": new TimerStart('timer_start'),
			"timer_resume": new TimerResume('timer_resume'),
			"timer_adjust": new TimerAdjust('timer_adjust'),
			"timer_pause": new TimerPause('timer_pause'),
			"timer_stop": new TimerStop('timer_stop'),
			"timer_stop_all": new TimerStopAll('timer_stop_all'),

			"stopwatch_start": new StopwatchStart('stopwatch_start'),
			"stopwatch_resume": new StopwatchResume('stopwatch_resume'),
			"stopwatch_adjust": new StopwatchAdjust('stopwatch_adjust'),
			"stopwatch_pause": new StopwatchPause('stopwatch_pause'),
			"stopwatch_stop": new StopwatchStop('stopwatch_stop'),
			"stopwatch_stop_all": new StopwatchStopAll('stopwatch_stop_all'),

			// Conditions.
			"timer_compare": new TimerCompare("timer_compare"),
			"timer_running": new TimerRunning("timer_running"),

			"stopwatch_compare": new StopwatchCompare("stopwatch_compare"),
			"stopwatch_running": new StopwatchRunning("stopwatch_running"),

			// Triggers.
			"timer_started": new TimerStarted('timer_started'),
			"timer_split": new TimerSplit('timer_split'),
			"timer_finished": new TimerFinished('timer_finished'),
			"timer_stopped": new TimerStopped('timer_stopped'),

			"stopwatch_started": new StopwatchStarted('stopwatch_started'),
			"stopwatch_split": new StopwatchSplit('stopwatch_split'),
			"stopwatch_stopped": new StopwatchStopped('stopwatch_stopped')
		};
	}

	_installLogEventHandlers() {
		Timer.events.on('log', (timer, text) => {
			this.log('[' + timer.getName() + '] ' + text);
		});
		Stopwatch.events.on('log', (stopwatch, text) => {
			this.log('[' + stopwatch.getName() + '] ' + text);
		});
	}

	_installTimerEventHandlers() {
		Timer.events.mon([ 'started', 'resumed', 'paused', 'updated', 'removed' ], (name, timer) => {
			let timerObj = {
				id: timer.getId(),
				name: timer.getName(),
				duration: timer.getDuration(),
				running: timer.isRunning(),
				removed: name == 'removed',
				now: (new Date()).getTime()
			};
			Homey.ManagerApi.realtime('timer_event', timerObj);
			let timersActive = Homey.ManagerSettings.get('timers_active') || {};
			if (name == 'removed') {
				delete(timersActive[timer.getId()]);
			} else {
				timersActive[timer.getId()] = timerObj;
			}
			Homey.ManagerSettings.set('timers_active', timersActive);
		});
	}

	_installStopwatchEventHandlers() {
		Stopwatch.events.mon([ 'started', 'resumed', 'paused', 'updated', 'removed' ], (name, stopwatch) => {
			let stopwatchObj = {
				id: stopwatch.getId(),
				name: stopwatch.getName(),
				duration: stopwatch.getDuration(),
				running: stopwatch.isRunning(),
				removed: name == 'removed',
				now: (new Date()).getTime()
			};
			Homey.ManagerApi.realtime('stopwatch_event', stopwatchObj);
			let stopwatchesActive = Homey.ManagerSettings.get('stopwatches_active') || {};
			if (name == 'removed') {
				delete(stopwatchesActive[stopwatch.getId()]);
			} else {
				stopwatchesActive[stopwatch.getId()] = stopwatchObj;
			}
			Homey.ManagerSettings.set('stopwatches_active', stopwatchesActive);
		});
	}

	_restoreTimers() {
		let timersActive = Homey.ManagerSettings.get('timers_active') || {};
		for (var timerId in timersActive) {
			let timerObj = timersActive[timerId];
			let duration = timerObj.duration;
			if (timerObj.running) {
				duration -= ((new Date()).getTime() - timerObj.now);
			}
			if (duration < 0) {
				continue;
			}
			let timer = new Timer(timerObj.name, duration / 1e3, 'seconds');
			let splits = Homey.ManagerSettings.get('timer_splits') || [];
			splits.forEach((split) => {
				timer.addSplit(split.time, split.unit);
			});
			if (timerObj.running) {
				timer.start(true);
			}
		}
	}

	_restoreStopwatches() {
		let stopwatchesActive = Homey.ManagerSettings.get('stopwatches_active') || {};
		for (var stopwatchId in stopwatchesActive) {
			let stopwatchObj = stopwatchesActive[stopwatchId];
			let duration = stopwatchObj.duration;
			if (stopwatchObj.running) {
				duration += ((new Date()).getTime() - stopwatchObj.now);
			}
			let stopwatch = new Stopwatch(stopwatchObj.name);
			let splits = Homey.ManagerSettings.get('stopwatch_splits') || [];
			splits.forEach((split) => {
				stopwatch.addSplit(split.time, split.unit);
			});
			stopwatch.adjust(duration / 1e3, 'seconds', true);
			if (stopwatchObj.running) {
				stopwatch.start(true);
			}
		}
	}
}

module.exports = Application;
