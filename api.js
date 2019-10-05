const Chronograph = require('./lib/chronograph.js');
const { ChronographType } = require('./lib/utils.js');

let getAllFn = (getter, args, callback) => {
	let result = [];
	getter().forEach(entity => {
		result.push({
			id: entity.getId(),
			prefix: entity.getPrefix(),
			name: entity.getName(),
			duration: entity.getDuration(),
			targetDuration: entity.getTargetDuration(),
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
		prefix: entity.getPrefix(),
		name: entity.getName(),
		duration: entity.getDuration(),
		targetDuration: entity.getTargetDuration(),
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
		prefix: entity.getPrefix(),
		name: entity.getName(),
		duration: entity.getDuration(),
		targetDuration: entity.getTargetDuration(),
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
		fn: getAllFn.bind(null, () => Chronograph.all().filter(entity => entity.getPrefix() == ChronographType.TIMER))
	},
	{
		method: 'GET',
		path: '/timers/:id',
		public: false,
		fn: getOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'PUT',
		path: '/timers/:id',
		public: false,
		fn: putOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'DELETE',
		path: '/timers/:id',
		public: false,
		fn: deleteOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'GET',
		path: '/stopwatches/',
		public: false,
		fn: getAllFn.bind(null, () => Chronograph.all().filter(entity => entity.getPrefix() == ChronographType.STOPWATCH))
	},
	{
		method: 'GET',
		path: '/stopwatches/:id',
		public: false,
		fn: getOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'PUT',
		path: '/stopwatches/:id',
		public: false,
		fn: putOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'DELETE',
		path: '/stopwatches/:id',
		public: false,
		fn: deleteOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'GET',
		path: '/transitions/',
		public: false,
		fn: getAllFn.bind(null, () => Chronograph.all().filter(entity => entity.getPrefix() == ChronographType.TRANSITION))
	},
	{
		method: 'GET',
		path: '/transitions/:id',
		public: false,
		fn: getOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'PUT',
		path: '/transitions/:id',
		public: false,
		fn: putOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'DELETE',
		path: '/transitions/:id',
		public: false,
		fn: deleteOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'GET',
		path: '/chronographs/',
		public: false,
		fn: getAllFn.bind(null, Chronograph.all)
	},
	{
		method: 'GET',
		path: '/chronographs/:id',
		public: false,
		fn: getOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'PUT',
		path: '/chronographs/:id',
		public: false,
		fn: putOneFn.bind(null, Chronograph.getById)
	},
	{
		method: 'DELETE',
		path: '/chronographs/:id',
		public: false,
		fn: deleteOneFn.bind(null, Chronograph.getById)
	}
];
