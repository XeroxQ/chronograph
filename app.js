'use strict';

const Homey = require('homey');
const Chronograph = require('./lib/chronograph.js');

// Actions.
const TimerStart = require('./lib/actions/timer_start.js');
const TimerAdjust = require('./lib/actions/timer_adjust.js');
const TimerStop = require('./lib/actions/timer_stop.js');
const StopwatchStart = require('./lib/actions/stopwatch_start.js');
const StopwatchAdjust = require('./lib/actions/stopwatch_adjust.js');
const StopwatchStop = require('./lib/actions/stopwatch_stop.js');

// Conditions.
const TimerCompare = require('./lib/conditions/timer_compare.js');
const TimerRunning = require('./lib/conditions/timer_running.js');
const StopwatchCompare = require('./lib/conditions/stopwatch_compare.js');
const StopwatchRunning = require('./lib/conditions/stopwatch_running.js');

// Triggers.
const TimerStarted = require('./lib/triggers/timer_started.js');
const TimerFinished = require('./lib/triggers/timer_finished.js');
const TimerRandomStarted = require('./lib/triggers/timer_random_started.js');
const TimerRandomFinished = require('./lib/triggers/timer_random_finished.js');
const StopwatchStarted = require('./lib/triggers/stopwatch_started.js');
const StopwatchRandomStarted = require('./lib/triggers/stopwatch_random_started.js');


class Application extends Homey.App {
	onInit() {
		Chronograph.setApplication(this);
		Chronograph.initializeCards({
			// Actions.
			"timer_start": new TimerStart('timer_start'),
			"timer_random_start": new TimerStart('timer_random_start'),
			"timer_adjust": new TimerAdjust('timer_adjust'),
			"timer_random_adjust": new TimerAdjust('timer_random_adjust'),
			"timer_stop": new TimerStop('timer_stop'),
			"timer_random_stop": new TimerStop('timer_random_stop'),

			// Conditions.
			"timer_compare": new TimerCompare("timer_compare"),
			"timer_random_compare": new TimerCompare('timer_random_compare'),
			"timer_running": new TimerRunning("timer_running"),
			"timer_random_running": new TimerRunning("timer_random_running"),

			// Triggers.
			"timer_started": new TimerStarted('timer_started'),
			"timer_finished": new TimerFinished('timer_finished'),
			"timer_random_started": new TimerRandomStarted('timer_random_started'),
			"timer_random_finished": new TimerRandomFinished('timer_random_finished')
		});

		this.log('Application is running.');
	}
}

module.exports = Application;