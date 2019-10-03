'use strict';

const Timer = require('./lib/timer/timer.js');
const Stopwatch = require('./lib/stopwatch/stopwatch.js');
const Transition = require('./lib/transition/transition.js');

let getAllFn = (getter, args, callback) => {
	let result = [];
	getter().forEach(entity => {
		result.push({
			id: entity.getId(),
			name: entity.getName(),
			duration: entity.getDuration(),
			running: entity.isRunning()
		});
	});
	callback(null, JSON.stringify(result));
};

let getOneFn = (getter, args, callback) => {
	let entity = getter(args.params.id);
	if (!entity) {
		callback(new Error('entity not found'), false);
		return;
	}
	callback(null, {
		id: entity.getId(),
		name: entity.getName(),
		duration: entity.getDuration(),
		running: entity.isRunning()
	});
};

let putOneFn = (getter, args, callback) => {
	let entity = getter(args.params.id);
	if (!entity) {
		callback(new Error('entity not found'), false);
		return;
	}
	if (
		args.body.running
		&& !entity.isRunning()
	) {
		entity.resume();
	}
	if (
		!args.body.running
		&& entity.isRunning()
	) {
		entity.pause();
	}
	callback(null, {
		id: entity.getId(),
		name: entity.getName(),
		duration: entity.getDuration(),
		running: entity.isRunning()
	});
};

let deleteOneFn = (getter, args, callback) => {
	let entity = getter(args.params.id);
	if (!entity) {
		callback(new Error('entity not found'), false);
		return;
	}
	entity.stop();
	callback(null, true);
};

module.exports = [
	{
		method: 'GET',
		path: '/timers/',
		public: false,
		fn: getAllFn.bind(null, Timer.all)
	},
	{
		method: 'GET',
		path: '/timers/:id',
		public: false,
		fn: getOneFn.bind(null, Timer.getById)
	},
	{
		method: 'PUT',
		path: '/timers/:id',
		public: false,
		fn: putOneFn.bind(null, Timer.getById)
	},
	{
		method: 'DELETE',
		path: '/timers/:id',
		public: false,
		fn: deleteOneFn.bind(null, Timer.getById)
	},
	{
		method: 'GET',
		path: '/stopwatches/',
		public: false,
		fn: getAllFn.bind(null, Stopwatch.all)
	},
	{
		method: 'GET',
		path: '/stopwatches/:id',
		public: false,
		fn: getOneFn.bind(null, Stopwatch.getById)
	},
	{
		method: 'PUT',
		path: '/stopwatches/:id',
		public: false,
		fn: putOneFn.bind(null, Stopwatch.getById)
	},
	{
		method: 'DELETE',
		path: '/stopwatches/:id',
		public: false,
		fn: deleteOneFn.bind(null, Stopwatch.getById)
	},
	{
		method: 'GET',
		path: '/transitions/',
		public: false,
		fn: getAllFn.bind(null, Transition.all)
	},
	{
		method: 'GET',
		path: '/transitions/:id',
		public: false,
		fn: getOneFn.bind(null, Transition.getById)
	},
	{
		method: 'PUT',
		path: '/transitions/:id',
		public: false,
		fn: putOneFn.bind(null, Transition.getById)
	},
	{
		method: 'DELETE',
		path: '/transitions/:id',
		public: false,
		fn: deleteOneFn.bind(null, Transition.getById)
	}
];
