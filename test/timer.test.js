'use strict';

const assert = require('assert');
const Timer = require('../lib/timer.js');

Timer.events.on('log', (timer, text) => {
//	console.log('[' + timer.getName() + '] ' + text);
});

let events = {};
Timer.events.on('created', (timer) => events.created = timer);
Timer.events.on('updated', (timer) => events.updated = timer);
Timer.events.on('started', (timer) => events.started = timer);
Timer.events.on('paused', (timer) => events.paused = timer);
Timer.events.on('resumed', (timer) => events.resumed = timer);
Timer.events.on('finished', (timer) => events.finished = timer);
Timer.events.on('stopped', (timer) => events.stopped = timer);
Timer.events.on('removed', (timer) => events.removed = timer);
Timer.events.on('split', () => events.split = !!events.split ? events.split + 1 : 1);

describe('Timer', () => {
	it('should be properly initialized', function() {
		let name = 'test timer 1';
		let timer = new Timer(name, 1, 'minutes');
		assert.ok(!!Timer.get(name), 'timer should be in global timers array');
		assert.equal(60000, timer.getDuration(), 'duration should be set correctly');
		assert.ok(!timer.isRunning(), 'new timer should not be running');
		assert.ok(!!events.created, 'created event should be emitted');
		assert.equal(timer, events.created, 'created event should emit correct timer');

		timer = new Timer(name, 1, 'days');
		assert.equal(60000 * 60 * 24, timer.getDuration(), 'duration should be set correctly');
		assert.ok(!timer.isRunning(), 'new timer should not be running');
		assert.ok(!!events.updated, 'updated event should be emitted');
		assert.equal(timer, events.updated, 'updated event should emit correct timer');
		timer.stop();
		timer.stop(); // second stop should do nothing
		assert.ok(!Timer.get(name), 'timer should not be in global timers array');

		assert.throws(() => {
			new Timer(name, 1, 'houses');
		}, 'invalid units should be rejected');
		assert.throws(() => {
			new Timer(name, 'a', 'seconds');
		}, 'invalid times should be rejected');

		events = {};
	});

	it('should start and finish a timer with fractional second precision', function(done) {
		this.timeout(250); // the entire test should not exceed this timeout

		let name = 'test timer 2';
		let timer = new Timer(name, 0.1, 'seconds');
		assert.ok(!!Timer.get(name), 'timer should be in global timers array');
		timer.start();
		timer.start(); // second start should do nothing
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(timer, events.started, 'started event should emit correct timer');
		assert.ok(timer.isRunning(), 'new timer should be running');
		setTimeout(() => {
			assert.ok(!Timer.get(name), 'timer should not be in global timers array after finish');
			assert.equal(0, timer.getDuration(), 'after finishing the timer should have a zero duration')
			assert.ok(!timer.isRunning(), 'new timer should not be running after finishing');
			assert.ok(!!events.finished, 'finished event should be emitted');
			assert.equal(timer, events.finished, 'finished event should emit correct timer');
			assert.ok(!!events.removed, 'removed event should be emitted');
			assert.equal(timer, events.removed, 'removed event should emit correct timer');
	
			events = {};
			done();
		}, 200);
	});

	it('should start and stop a timer', function(done) {
		this.timeout(1250); // the entire test should not exceed this timeout

		let name = 'test timer 3';
		let timer = new Timer(name, 0.3, 'seconds');
		assert.ok(!!Timer.get(name), 'timer should be in global timers array');
		timer.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(timer, events.started, 'started event should emit correct timer');

		setTimeout(() => {
			timer.stop();
			assert.ok(!Timer.get(name), 'timer should not be in global timers array after stopping');
			assert.equal(0, timer.getDuration(), 'stopped timer should have a zero duration')
			assert.ok(!timer.isRunning(), 'stopped timer should not be running');
			assert.ok(!!events.stopped, 'stopped event should be emitted');
			assert.equal(timer, events.stopped, 'stopped event should emit correct timer');

			setTimeout(() => {
				assert.ok(!events.finished, 'finished event should not be emitted');
				assert.ok(!events.split, 'split event should not be emitted');
				assert.ok(!events.paused, 'paused event should not be emitted');
				assert.ok(!events.resumed, 'resumed event should not be emitted');
	
				events = {};
				done();
			}, 1000); // stopped
		}, 200); // running
	});

	it('should start, pause, resume and finish a timer', function(done) {
		this.timeout(3100); // the entire test should not exceed this timeout

		let name = 'test timer 4';
		let timer = new Timer(name, 2, 'seconds');
		assert.ok(!!Timer.get(name), 'timer should be in global timers array');
		timer.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(timer, events.started, 'started event should emit correct timer');

		setTimeout(() => {
			assert.ok(timer.isRunning(), 'timer should be running');
			timer.pause();
			assert.ok(!timer.isRunning(), 'paused timer should not be running');
			assert.ok(!!Timer.get(name), 'timer should still be in global timers array after pause');
			assert.ok(timer.getDuration() > 1450 && timer.getDuration() < 1550, 'timer should stopped at the correct position');
			assert.ok(!!events.paused, 'paused event should be emitted');
			assert.equal(timer, events.paused, 'paused event should emit correct timer');

			setTimeout(() => {
				assert.ok(timer.getDuration() > 1450 && timer.getDuration() < 1550, 'timer should not moved when paused');
				timer.resume();
				assert.ok(!!Timer.get(name), 'timer should still be in global timers array after resume');
				assert.ok(timer.isRunning(), 'timer should be running');
				assert.ok(!!events.resumed, 'resumed event should be emitted');
				assert.equal(timer, events.resumed, 'resumed event should emit correct timer');
		
				setTimeout(() => {
					assert.ok(timer.getDuration() > 950 && timer.getDuration() < 1050, 'timer duration should be correct while running');
					timer.pause();
					assert.ok(timer.getDuration() > 950 && timer.getDuration() < 1050, 'timer duration should be correct while paused');
					assert.ok(!timer.isRunning(), 'paused timer should not be running');
					assert.ok(!!Timer.get(name), 'timer should still be in global timers array after pause');
					timer.resume();

					setTimeout(() => {
						assert.ok(!Timer.get(name), 'timer should not be in global timers array after finish');
						assert.equal(0, timer.getDuration(), 'after finishing the timer should have a zero duration')
						assert.ok(!timer.isRunning(), 'new timer should not be running after finishing');
						assert.ok(!!events.finished, 'finished event should be emitted');
						assert.equal(timer, events.finished, 'finished event should emit correct timer');
						assert.ok(!!events.removed, 'removed event should be emitted');
						assert.equal(timer, events.removed, 'removed event should emit correct timer');

						events = {};
						done();
					}, 1050); // running
				}, 500); // running
			}, 1000); // paused
		}, 500); // running
	});

	it('should start, pause and stop a timer', function(done) {
		this.timeout(250); // the entire test should not exceed this timeout

		let name = 'test timer 5';
		let timer = new Timer(name, 1, 'days');
		assert.ok(!!Timer.get(name), 'timer should be in global timers array');
		timer.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(timer, events.started, 'started event should emit correct timer');

		setTimeout(() => {
			assert.ok(timer.isRunning(), 'timer should be running');
			timer.pause();
			assert.ok(!timer.isRunning(), 'paused timer should not be running');
			assert.ok(timer.getDuration() > 86399850 && timer.getDuration() < 86399950, 'timer should be paused at the correct position');
			assert.ok(!!events.paused, 'paused event should be emitted');
			assert.equal(timer, events.paused, 'paused event should emit correct timer');

			setTimeout(() => {
				assert.ok(!timer.isRunning(), 'paused timer should not be running');
				timer.stop();
				assert.ok(!Timer.get(name), 'timer should not be in global timers array after stopping');
				assert.equal(0, timer.getDuration(), 'stopped timer should have a zero duration')
				assert.ok(!timer.isRunning(), 'stopped timer should not be running');
				assert.ok(!!events.stopped, 'stopped event should be emitted');
				assert.equal(timer, events.stopped, 'stopped event should emit correct timer');

				events = {};
				done();
			}, 100); // paused
		}, 100); // running
	});

	it('should start, split, pause, split and stop a timer', function(done) {
		this.timeout(2300); // the entire test should not exceed this timeout

		let name = 'test timer 6';
		let timer = new Timer(name, 1, 'seconds');
		assert.ok(!!Timer.get(name), 'timer should be in global timers array');
		timer.addSplit(1.1, 'seconds');
		timer.addSplit(0.8, 'seconds');
		timer.addSplit(0.6, 'seconds');
		timer.addSplit(0.3, 'seconds');
		timer.addSplit(0.2, 'seconds');
		timer.addSplit(0.1, 'seconds');
		timer.start();

		setTimeout(() => {
			assert.ok(timer.isRunning(), 'timer should be running');
			timer.pause();
			assert.ok(!timer.isRunning(), 'paused timer should not be running');
			assert.equal(events.split, 2, 'two split events should be emitted')

			setTimeout(() => {
				assert.equal(events.split, 2, 'splits should be paused too')
				timer.resume();

				setTimeout(() => {
					assert.equal(events.split, 3, 'third split should come in the correct time')
					timer.stop();

					setTimeout(() => {
						assert.equal(events.split, 3, 'splits should be stopped too')
						assert.equal(timer.getDuration(), 0, 'stopped timer should have a zero duration')
						assert.ok(!timer.isRunning(), 'stopped timer should not be running');
		
						events = {};
						done();
					}, 300); // stopped
				}, 250); // running
			}, 1200); // paused
		}, 500); // running
	});

	it('should start, split, pause, adjust, start, adjust, split and finish a timer', function(done) {
		this.timeout(4150); // the entire test should not exceed this timeout

		let name = 'test timer 7';
		let timer = new Timer(name, 1, 'hours');
		assert.ok(!!Timer.get(name), 'timer should be in global timers array');
		timer.addSplit(3599.5, 'seconds');
		timer.addSplit(3599.3, 'seconds');
		timer.addSplit(0.5, 'seconds');
		timer.start();

		setTimeout(() => {
			assert.ok(timer.isRunning(), 'timer should be running');
			timer.pause();
			assert.ok(!timer.isRunning(), 'paused timer should not be running');
			assert.equal(1, events.split, 'one split events should be emitted')
			timer.adjust(-0.2, 'seconds'); // B)
			assert.ok(!timer.isRunning(), 'adjusted timer should not be running');

			setTimeout(() => {
				assert.equal(1, events.split, 'one split events should be emitted')
				timer.resume();

				events = {};
				setTimeout(() => {
					timer.adjust(1.8, 'seconds'); // A) + B) + C)

					setTimeout(() => {
						assert.equal(2, events.split, 'two split events should be emitted')
						timer.adjust(-3598.6, 'seconds');

						setTimeout(() => {
							assert.equal(2, events.split, 'two split events should be emitted')
							assert.equal(0, timer.getDuration(), 'finished timer should have a zero duration')
							assert.ok(!timer.isRunning(), 'finished timer should not be running');
	
							assert.ok(!events.paused, 'paused event should not be emitted');
							assert.ok(!events.resumed, 'paused event should not be emitted');
							assert.ok(!events.stopped, 'stopped event should not be emitted');
							assert.ok(!!events.finished, 'finished event should be emitted');
							assert.equal(timer, events.finished, 'finished event should emit correct timer');
							assert.ok(!Timer.get(name), 'timer should not be in global timers array after finish');

							events = {};
							done();
						}, 500); // running
					}, 1000); // running
				}, 1000); // running C)
			}, 1000); // paused
		}, 600); // running A)
	});

	it('should allow for multiple timers at once', function(done) {
		for (var i = 1; i <= 50; i++) {
			new Timer('bulk timer ' + i, Math.random(), 'seconds');
		}
		assert.equal(50, Timer.all().length);
		Timer.all().forEach((timer) => {
			timer.start();
		});
		setTimeout(() => {
			assert.equal(0, Timer.all().length);

			events = {};
			done();
		}, 1050);
	});
});
