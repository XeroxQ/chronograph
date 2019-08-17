'use strict';

const Homey = require('homey');

// Actions.
const TimerStart = require('./lib/actions/timer_start.js');
const TimerAdjust = require('./lib/actions/timer_adjust.js');
const TimerStop = require('./lib/actions/timer_stop.js');
const TimerRandomStart = require('./lib/actions/timer_random_start.js');
const TimerRandomAdjust = require('./lib/actions/timer_random_adjust.js');
const TimerRandomStop = require('./lib/actions/timer_random_stop.js');
const StopwatchStart = require('./lib/actions/stopwatch_start.js');
const StopwatchAdjust = require('./lib/actions/stopwatch_adjust.js');
const StopwatchStop = require('./lib/actions/stopwatch_stop.js');
const StopwatchRandomStart = require('./lib/actions/stopwatch_random_start.js');
const StopwatchRandomAdjust = require('./lib/actions/stopwatch_random_adjust.js');
const StopwatchRandomStop = require('./lib/actions/stopwatch_random_stop.js');

// Conditions.
const TimerCompare = require('./lib/conditions/timer_compare.js');
const TimerRunning = require('./lib/conditions/timer_running.js');
const TimerRandomCompare = require('./lib/conditions/timer_random_compare.js');
const TimerRandomRunning = require('./lib/conditions/timer_random_running.js');
const StopwatchCompare = require('./lib/conditions/stopwatch_compare.js');
const StopwatchRunning = require('./lib/conditions/stopwatch_running.js');
const StopwatchRandomCompare = require('./lib/conditions/stopwatch_random_compare.js');
const StopwatchRandomRunning = require('./lib/conditions/stopwatch_random_running.js');

// Triggers.
const TimerStarted = require('./lib/triggers/timer_started.js');
const TimerFinished = require('./lib/triggers/timer_finished.js');
const TimerRandomStarted = require('./lib/triggers/timer_random_started.js');
const TimerRandomFinished = require('./lib/triggers/timer_random_finished.js');
const StopwatchStarted = require('./lib/triggers/stopwatch_started.js');
const StopwatchRandomStarted = require('./lib/triggers/stopwatch_random_started.js');


class Chronograph extends Homey.App {
	onInit() {
		let self = this;

		let cards = [
			new TimerStart('timer_start'),
			new TimerAdjust('timer_adjust'),
			new TimerStop('timer_stop'),
			new TimerRandomStart('timer_random_start'),
			new TimerRandomAdjust('timer_random_adjust'),
			new TimerRandomStop('timer_random_stop'),
			new StopwatchStart('stopwatch_start'),
			new StopwatchAdjust('stopwatch_adjust'),
			new StopwatchStop('stopwatch_stop'),
			new StopwatchRandomStart('stopwatch_random_start'),
			new StopwatchRandomAdjust('stopwatch_random_adjust'),
			new StopwatchRandomStop('stopwatch_random_stop'),

			new TimerCompare('timer_compare'),
			new TimerRunning('timer_running'),
			new TimerRandomCompare('timer_random_compare'),
			new TimerRandomRunning('timer_random_running'),
			new StopwatchCompare('stopwatch_compare'),
			new StopwatchRunning('stopwatch_running'),
			new StopwatchRandomCompare('stopwatch_random_compare'),
			new StopwatchRandomRunning('stopwatch_random_running'),

			new TimerStarted('timer_started'),
			new TimerFinished('timer_finished'),
			new TimerRandomStarted('timer_random_started'),
			new TimerRandomFinished('timer_random_finished'),
			new StopwatchStarted('stopwatch_started'),
			new StopwatchRandomStarted('stopwatch_random_started')
		];		
		
		self.log('Application is running.');
	}
}

Chronograph.timers = [];
Chronograph.stopwatches = [];

module.exports = Chronograph;