'use strict';

const Timer = require('./lib/timer.js');
const Stopwatch = require('./lib/stopwatch.js');

module.exports = [
	{
		method: 'GET',
		path: '/timers/',
		public: true,
		fn: function(args, callback) {
			let result = [];
			for (var timerId in Timer.timers) {
				let timer = Timer.get(timerId);
				result.push({
					id: timer.getId(),
					name: timer.getName(),
					duration: timer.getDuration()
				});
			}
			callback(null, JSON.stringify(result));
		}
	},
	{
		method: 'DELETE',
		path: '/timers/:id',
		fn: function(args, callback) {
			let timer = Timer.get(args.params.id);
			if (!!timer) {
				timer.stop();
			}
		}
	},
	{
		method: 'GET',
		path: '/stopwatches/',
		fn: function(args, callback) {
			let result = [];
			for (var stopwatchId in Stopwatch.stopwatches) {
				let stopwatch = Stopwatch.get(stopwatchId);
				result.push({
					id: stopwatch.getId(),
					name: stopwatch.getName(),
					duration: stopwatch.getDuration()
				});
			}
			callback(null, JSON.stringify(result));
		}
	},
	{
		method: 'DELETE',
		path: '/stopwatches/:id',
		fn: function(args, callback) {
			let stopwatch = Stopwatch.get(args.params.id);
			if (!!stopwatch) {
				stopwatch.stop();
			}
		}
	}
];
