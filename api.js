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
			Timer.all().forEach((timer) => {
				result.push({
					id: timer.getId(),
					name: timer.getName(),
					duration: timer.getDuration(),
					running: timer.isRunning()
				});
			});
			callback(null, JSON.stringify(result));
		}
	},
	{
		method: 'GET',
		path: '/timers/:id',
		public: true,
		fn: function(args, callback) {
			let timer = Timer.getById(args.params.id);
			if (!!timer) {
				callback(null, {
					id: timer.getId(),
					name: timer.getName(),
					duration: timer.getDuration(),
					running: timer.isRunning()
				});
			} else {
				callback(new Error('timer not found'), false);
			}
		}
	},
	{
		method: 'PUT',
		path: '/timers/:id',
		public: true,
		fn: function(args, callback) {
			let timer = Timer.getById(args.params.id);
			if (!!timer) {
				if (args.body.running) {
					if (!timer.isRunning()) {
						timer.resume();
					}
				} else {
					if (timer.isRunning()) {
						timer.pause();
					}
				}
				callback(null, {
					id: timer.getId(),
					name: timer.getName(),
					duration: timer.getDuration(),
					running: timer.isRunning()
				});
			} else {
				callback(new Error('timer not found'), false);
			}
		}
	},
	{
		method: 'DELETE',
		path: '/timers/:id',
		fn: function(args, callback) {
			let timer = Timer.getById(args.params.id);
			if (!!timer) {
				timer.stop();
				callback(null, true);
			} else {
				callback(new Error('timer not found'), false);
			}
		}
	},
	{
		method: 'GET',
		path: '/stopwatches/',
		fn: function(args, callback) {
			let result = [];
			Stopwatch.all().forEach((stopwatch) => {
				result.push({
					id: stopwatch.getId(),
					name: stopwatch.getName(),
					duration: stopwatch.getDuration(),
					running: stopwatch.isRunning()
				});
			});
			callback(null, JSON.stringify(result));
		}
	},
	{
		method: 'GET',
		path: '/stopwatches/:id',
		public: true,
		fn: function(args, callback) {
			let stopwatch = Stopwatch.getById(args.params.id);
			if (!!stopwatch) {
				callback(null, {
					id: stopwatch.getId(),
					name: stopwatch.getName(),
					duration: stopwatch.getDuration(),
					running: stopwatch.isRunning()
				});
			} else {
				callback(new Error('stopwatch not found'), false);
			}
		}
	},
	{
		method: 'PUT',
		path: '/stopwatches/:id',
		public: true,
		fn: function(args, callback) {
			let stopwatch = Stopwatch.getById(args.params.id);
			if (!!stopwatch) {
				if (args.body.running) {
					if (!stopwatch.isRunning()) {
						stopwatch.resume();
					}
				} else {
					if (stopwatch.isRunning()) {
						stopwatch.pause();
					}
				}
				callback(null, {
					id: stopwatch.getId(),
					name: stopwatch.getName(),
					duration: stopwatch.getDuration(),
					running: stopwatch.isRunning()
				});
			} else {
				callback(new Error('stopwatch not found'), false);
			}
		}
	},
	{
		method: 'DELETE',
		path: '/stopwatches/:id',
		fn: function(args, callback) {
			let stopwatch = Stopwatch.getById(args.params.id);
			if (!!stopwatch) {
				stopwatch.stop();
				callback(null, true);
			} else {
				callback(new Error('stopwatch not found'), false);
			}
		}
	}
];
