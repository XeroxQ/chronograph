'use strict';

const Timer = require('./lib/timer/timer.js');
const Stopwatch = require('./lib/stopwatch/stopwatch.js');
const Transition = require('./lib/transition/transition.js');

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
		//public: false,
		fn: function(args, callback) {
			let timer = Timer.getById(args.params.id);
			if (!timer) {
				callback(new Error('timer not found'), false);
				return;
			}
			callback(null, {
				id: timer.getId(),
				name: timer.getName(),
				duration: timer.getDuration(),
				running: timer.isRunning()
			});
		}
	},
	{
		method: 'PUT',
		path: '/timers/:id',
		//public: false,
		fn: function(args, callback) {
			let timer = Timer.getById(args.params.id);
			if (!timer) {
				callback(new Error('timer not found'), false);
				return;
			}
			if (
				args.body.running
				&& !timer.isRunning()
			) {
				timer.resume();
			}
			if (
				!args.body.running
				&& timer.isRunning()
			) {
				timer.pause();
			}
			callback(null, {
				id: timer.getId(),
				name: timer.getName(),
				duration: timer.getDuration(),
				running: timer.isRunning()
			});
		}
	},
	{
		method: 'DELETE',
		path: '/timers/:id',
		//public: false,
		fn: function(args, callback) {
			let timer = Timer.getById(args.params.id);
			if (!timer) {
				callback(new Error('timer not found'), false);
				return;
			}
			timer.stop();
			callback(null, true);
		}
	},
	{
		method: 'GET',
		path: '/stopwatches/',
		//public: false,
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
		//public: false,
		fn: function(args, callback) {
			let stopwatch = Stopwatch.getById(args.params.id);
			if (!stopwatch) {
				callback(new Error('stopwatch not found'), false);
				return;
			}
			callback(null, {
				id: stopwatch.getId(),
				name: stopwatch.getName(),
				duration: stopwatch.getDuration(),
				running: stopwatch.isRunning()
			});
		}
	},
	{
		method: 'PUT',
		path: '/stopwatches/:id',
		//public: false,
		fn: function(args, callback) {
			let stopwatch = Stopwatch.getById(args.params.id);
			if (!stopwatch) {
				callback(new Error('stopwatch not found'), false);
				return;
			}
			if (
				args.body.running
				&& !stopwatch.isRunning()
			) {
				stopwatch.resume();
			}
			if (
				!args.body.running
				&& stopwatch.isRunning()
			) {
				stopwatch.pause();
			}
			callback(null, {
				id: stopwatch.getId(),
				name: stopwatch.getName(),
				duration: stopwatch.getDuration(),
				running: stopwatch.isRunning()
			});
		}
	},
	{
		method: 'DELETE',
		path: '/stopwatches/:id',
		//public: false,
		fn: function(args, callback) {
			let stopwatch = Stopwatch.getById(args.params.id);
			if (!stopwatch) {
				callback(new Error('stopwatch not found'), false);
				return;
			}
			stopwatch.stop();
			callback(null, true);
		}
	},
	{
		method: 'GET',
		path: '/transitions/',
		//public: false,
		fn: function(args, callback) {
			let result = [];
			Transition.all().forEach((transition) => {
				result.push({
					id: transition.getId(),
					name: transition.getName(),
					duration: transition.getDuration(),
					running: transition.isRunning()
				});
			});
			callback(null, JSON.stringify(result));
		}
	},
	{
		method: 'GET',
		path: '/transitions/:id',
		//public: false,
		fn: function(args, callback) {
			let transition = Transition.getById(args.params.id);
			if (!transition) {
				callback(new Error('transition not found'), false);
				return;
			}
			callback(null, {
				id: transition.getId(),
				name: transition.getName(),
				duration: transition.getDuration(),
				running: transition.isRunning()
			});
		}
	},
	{
		method: 'PUT',
		path: '/transitions/:id',
		//public: false,
		fn: function(args, callback) {
			let transition = Transition.getById(args.params.id);
			if (!transition) {
				callback(new Error('transition not found'), false);
				return;
			}
			if (
				args.body.running
				&& !transition.isRunning()
			) {
				transition.resume();
			}
			if (
				!args.body.running
				&& transition.isRunning()
			) {
				transition.pause();
			}
			callback(null, {
				id: transition.getId(),
				name: transition.getName(),
				duration: transition.getDuration(),
				running: transition.isRunning()
			});
		}
	},
	{
		method: 'DELETE',
		path: '/transitions/:id',
		//public: false,
		fn: function(args, callback) {
			let transition = Transition.getById(args.params.id);
			if (!transition) {
				callback(new Error('transition not found'), false);
				return;
			}
			transition.stop();
			callback(null, true);
		}
	}
];
