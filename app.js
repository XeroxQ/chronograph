'use strict';

const Homey = require('homey');
const Chronograph = require('./lib/chronograph.js');
const Timer = require('./lib/timer.js');
const Stopwatch = require('./lib/stopwatch.js');

// Actions.
const TimerStart = require('./lib/actions/timer_start.js');
const TimerAdjust = require('./lib/actions/timer_adjust.js');
const TimerStop = require('./lib/actions/timer_stop.js');
const TimerStopAll = require('./lib/actions/timer_stop_all.js');
const StopwatchStart = require('./lib/actions/stopwatch_start.js');
const StopwatchAdjust = require('./lib/actions/stopwatch_adjust.js');
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
		Chronograph.setApplication(this);

		// Initializing cards.
		this.log('Initializing cards.');
		Chronograph.initializeCards({
			// Actions.
			"timer_start": new TimerStart('timer_start'),
			"timer_adjust": new TimerAdjust('timer_adjust'),
			"timer_stop": new TimerStop('timer_stop'),
			"timer_stop_all": new TimerStopAll('timer_stop_all'),

			"stopwatch_start": new StopwatchStart('stopwatch_start'),
			"stopwatch_adjust": new StopwatchAdjust('stopwatch_adjust'),
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
		});

		// Restore timers and stopwatches from settings.
		this.log('Restoring timers.');
		let timersActive = Homey.ManagerSettings.get('timers_active') || {};
		for (var timerId in timersActive) {
			let timerDef = timersActive[timerId];
			new Timer(timerDef.id, timerDef.name, timerDef.time, timerDef.unit, timerDef.started);
		}

		this.log('Restoring stopwatches.');
		let stopwatchesActive = Homey.ManagerSettings.get('stopwatches_active') || {};
		for (var stopwatchId in stopwatchesActive) {
			let stopwatchDef = stopwatchesActive[stopwatchId];
			new Stopwatch(stopwatchDef.id, stopwatchDef.name, stopwatchDef.started);
		}

		this.log('Application is running.');
	}
}

module.exports = Application;
