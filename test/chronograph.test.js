'use strict';

const assert = require('assert');
const mock = require('mock-require');

mock('homey', {
});

const Timer = require('../lib/timer.js');
const Stopwatch = require('../lib/stopwatch.js');

describe('Timer', () => {
	it('should generate valid id\'s', function() {
		let id = Timer.generateId("id's should # not contain any @ spécial characters");
		assert.ok(id.match(/[a-z0-9-]+/i));
	});

	/*
	it('should start and stop a timer with fractional second precision', function(done) {
		let name = 'test timer';
		let id = Timer.generateId(name);
		let timer = new Timer(id, name, 0.1, 'seconds');
		assert.ok(!!Timer.timers[id]);
		assert.ok(!!Timer.get(id));

		this.timeout(300);
		setTimeout(() => {
			assert.ok(!Timer.timers[id]);
			assert.ok(!Timer.get(id));
			done();
		}, 200);
	});

	it('should start and stop a timer with second precision', function(done) {
		let name = 'test timer';
		let id = Timer.generateId(name);
		let timer = new Timer(id, name, 1, 'seconds');
		assert.ok(!!Timer.timers[id]);
		assert.ok(!!Timer.get(id));

		this.timeout(3000);
		setTimeout(() => {
			assert.ok(!Timer.timers[id]);
			assert.ok(!Timer.get(id));
			done();
		}, 2000);
	});
	*/

	it('should disallow invalid unit', function() {
		let name = 'test timer';
		let id = Timer.generateId(name);
		assert.throws(() => {
			new Timer(id, name, 14, 'cars');
		});
	});
});

describe('Stopwatch', () => {
	it('should generate valid id\'s', function() {
		let id = Stopwatch.generateId("id's should # not contain any @ spécial characters");
		assert.ok(id.match(/[a-z0-9-]+/i));
	});

	it('should disallow invalid unit', function() {
		let name = 'test stopwatch';
		let id = Stopwatch.generateId(name);
		assert.throws(() => {
			new Stopwatch(id, name, 8, 'horses');
		});
	});
});