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
			"timer_stop": new TimerStop('timer_stop'),
			"timer_random_stop": new TimerStop('timer_random_stop'),

			// Triggers.
			"timer_started": new TimerStarted('timer_started'),
			"timer_finished": new TimerFinished('timer_finished'),
			"timer_random_started": new TimerRandomStarted('timer_random_started'),
			"timer_random_finished": new TimerRandomFinished('timer_random_finished')
		});

		this.log('Application is running.');


		/*
		let cards = [
			// Actions.
			new TimerStart('timer_start'),
			new TimerAdjust('timer_adjust'),
			new TimerStop('timer_stop'),
			new TimerStart('timer_random_start'),
			new TimerAdjust('timer_random_adjust'),
			new TimerStop('timer_random_stop'),
			new StopwatchStart('stopwatch_start'),
			new StopwatchAdjust('stopwatch_adjust'),
			new StopwatchStop('stopwatch_stop'),
			new StopwatchStart('stopwatch_random_start'),
			new StopwatchAdjust('stopwatch_random_adjust'),
			new StopwatchStop('stopwatch_random_stop'),

			// Conditions.
			new TimerCompare('timer_compare'),
			new TimerRunning('timer_running'),
			new TimerCompare('timer_random_compare'),
			new TimerRunning('timer_random_running'),
			new StopwatchCompare('stopwatch_compare'),
			new StopwatchRunning('stopwatch_running'),
			new StopwatchCompare('stopwatch_random_compare'),
			new StopwatchRunning('stopwatch_random_running'),

			// Trigger flow cards are different for device triggers and flow triggers, so each
			// variant has it's own class.
			new TimerStarted('timer_started'),
			new TimerFinished('timer_finished'),
			new TimerStarted('timer_started'),
			new TimerFinished('timer_finished'),
			new TimerRandomStarted('timer_random_started'),
			new TimerRandomFinished('timer_random_finished'),
			new StopwatchStarted('stopwatch_started'),
			new StopwatchRandomStarted('stopwatch_random_started')
		];		
		*/

		
	}
}

module.exports = Application;