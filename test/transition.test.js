'use strict';

const assert = require('assert');
const Transition = require('../lib/transition/transition.js');

Transition.events.on('log', (transition, text) => {
//	console.log('[' + transition.getName() + '] ' + text);
});

let events = {};
Transition.events.on('created', (transition) => events.created = transition);
Transition.events.on('updated', (transition) => events.updated = transition);
Transition.events.on('started', (transition) => events.started = transition);
Transition.events.on('paused', (transition) => events.paused = transition);
Transition.events.on('resumed', (transition) => events.resumed = transition);
Transition.events.on('finished', (transition) => events.finished = transition);
Transition.events.on('stopped', (transition) => events.stopped = transition);
Transition.events.on('removed', (transition) => events.removed = transition);
Transition.events.on('step', () => events.step = !!events.step ? events.step + 1 : 1);

describe('Transition', () => {
	it('should be properly initialized', function() {
		let name = 'test transition 1';
		let transition = new Transition(name, 1, 'minutes', 10, 5, 10);
		assert.ok(!!Transition.get(name), 'transition should be in global transitions array');
		assert.ok(!transition.isRunning(), 'new transition should not be running');
		assert.ok(!!events.created, 'created event should be emitted');
		assert.equal(transition, events.created, 'created event should emit correct transition');

		transition = new Transition(name, 1, 'days', 99, 200, 5);
		assert.ok(!transition.isRunning(), 'new transition should not be running');
		assert.ok(!!events.updated, 'updated event should be emitted');
		assert.equal(transition, events.updated, 'updated event should emit correct transition');
		transition.stop();
		transition.stop(); // second stop should do nothing
		assert.ok(!Transition.get(name), 'transition should not be in global transitions array');

		events = {};
	});

	it('should start and finish a transition with fractional second precision', function(done) {
		this.timeout(250); // the entire test should not exceed this timeout

		let name = 'test transition 2';
		let transition = new Transition(name, 0.1, 'seconds', 10, 5, 3);
		assert.ok(!!Transition.get(name), 'transition should be in global transition array');
		transition.start();
		transition.start(); // second start should do nothing
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(transition, events.started, 'started event should emit correct transition');
		assert.ok(transition.isRunning(), 'new transition should be running');
		setTimeout(() => {
			assert.ok(!Transition.get(name), 'transition should not be in global transitions array after finish');
			assert.ok(transition.getDuration() > 50 && transition.getDuration() < 150, 'transition should be stopped at the correct position');
			assert.ok(!transition.isRunning(), 'new transition should not be running after finishing');
			assert.ok(!!events.finished, 'finished event should be emitted');
			assert.equal(transition, events.finished, 'finished event should emit correct transition');
			assert.ok(!!events.removed, 'removed event should be emitted');
			assert.equal(transition, events.removed, 'removed event should emit correct transition');
	
			events = {};
			done();
		}, 200);
	});

	it('should start and stop a transition', function(done) {
		this.timeout(1250); // the entire test should not exceed this timeout

		let name = 'test transition 3';
		let transition = new Transition(name, 0.3, 'seconds', 4, 5, 12);
		assert.ok(!!Transition.get(name), 'transition should be in global transitions array');
		transition.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(transition, events.started, 'started event should emit correct transition');

		setTimeout(() => {
			transition.stop();
			assert.ok(!Transition.get(name), 'transition should not be in global transitions array after stopping');
			assert.ok(transition.getDuration() > 150 && transition.getDuration() < 250, 'transition should be stopped at the correct position');
			assert.ok(!transition.isRunning(), 'stopped transition should not be running');
			assert.ok(!!events.stopped, 'stopped event should be emitted');
			assert.equal(transition, events.stopped, 'stopped event should emit correct transition');

			setTimeout(() => {
				assert.ok(!events.finished, 'finished event should not be emitted');
				assert.ok(!events.paused, 'paused event should not be emitted');
				assert.ok(!events.resumed, 'resumed event should not be emitted');
	
				events = {};
				done();
			}, 1000); // stopped
		}, 200); // running
	});

	it('should start, pause, resume and finish a transition', function(done) {
		this.timeout(3100); // the entire test should not exceed this timeout

		let name = 'test transition 4';
		let transition = new Transition(name, 2, 'seconds', 123, 456, 4);
		assert.ok(!!Transition.get(name), 'transition should be in global transitions array');
		transition.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(transition, events.started, 'started event should emit correct transition');

		setTimeout(() => {
			assert.ok(transition.isRunning(), 'transition should be running');
			transition.pause();
			assert.ok(!transition.isRunning(), 'paused transition should not be running');
			assert.ok(!!Transition.get(name), 'transition should still be in global transitions array after pause');
			assert.ok(transition.getDuration() > 450 && transition.getDuration() < 550, 'transition should stopped at the correct position');
			assert.ok(!!events.paused, 'paused event should be emitted');
			assert.equal(transition, events.paused, 'paused event should emit correct transition');

			setTimeout(() => {
				assert.ok(transition.getDuration() > 450 && transition.getDuration() < 550, 'transition should not moved when paused');
				transition.resume();
				assert.ok(!!Transition.get(name), 'transition should still be in global transitions array after resume');
				assert.ok(transition.isRunning(), 'transition should be running');
				assert.ok(!!events.resumed, 'resumed event should be emitted');
				assert.equal(transition, events.resumed, 'resumed event should emit correct transition');
		
				setTimeout(() => {
					assert.ok(transition.getDuration() > 950 && transition.getDuration() < 1050, 'transition duration should be correct while running');
					transition.pause();
					assert.ok(transition.getDuration() > 950 && transition.getDuration() < 1050, 'transition duration should be correct while paused');
					assert.ok(!transition.isRunning(), 'paused transition should not be running');
					assert.ok(!!Transition.get(name), 'transition should still be in global transitions array after pause');
					transition.resume();

					setTimeout(() => {
						assert.ok(!Transition.get(name), 'transition should not be in global transitions array after finish');
						assert.ok(transition.getDuration() > 1950 && transition.getDuration() < 2050, 'transition duration should be correct while paused');
						assert.ok(!transition.isRunning(), 'new transition should not be running after finishing');
						assert.ok(!!events.finished, 'finished event should be emitted');
						assert.equal(transition, events.finished, 'finished event should emit correct transition');
						assert.ok(!!events.removed, 'removed event should be emitted');
						assert.equal(transition, events.removed, 'removed event should emit correct transition');

						events = {};
						done();
					}, 1050); // running
				}, 500); // running
			}, 1000); // paused
		}, 500); // running
	});

	it('should start, pause and stop a transition', function(done) {
		this.timeout(250); // the entire test should not exceed this timeout

		let name = 'test transition 5';
		let transition = new Transition(name, 1, 'days', 8, 6, 4);
		assert.ok(!!Transition.get(name), 'transition should be in global transitions array');
		transition.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(transition, events.started, 'started event should emit correct transition');

		setTimeout(() => {
			assert.ok(transition.isRunning(), 'transition should be running');
			transition.pause();
			assert.ok(!transition.isRunning(), 'paused transition should not be running');
			assert.ok(transition.getDuration() > 50 && transition.getDuration() < 150, 'transition should be paused at the correct position');
			assert.ok(!!events.paused, 'paused event should be emitted');
			assert.equal(transition, events.paused, 'paused event should emit correct transition');

			setTimeout(() => {
				assert.ok(!transition.isRunning(), 'paused transition should not be running');
				transition.stop();
				assert.ok(!Transition.get(name), 'transition should not be in global transitions array after stopping');
				assert.ok(transition.getDuration() > 50 && transition.getDuration() < 150, 'transition should be stopped at the correct position');
				assert.ok(!transition.isRunning(), 'stopped transition should not be running');
				assert.ok(!!events.stopped, 'stopped event should be emitted');
				assert.equal(transition, events.stopped, 'stopped event should emit correct transition');

				events = {};
				done();
			}, 100); // paused
		}, 100); // running
	});

	/*
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
	*/

	it('should allow for multiple transitions at once', function(done) {
		for (var i = 1; i <= 50; i++) {
			new Transition('bulk transition ' + i, Math.random(), 'seconds', 1, 2, 10);
		}
		assert.equal(50, Transition.all().length);
		Transition.all().forEach((transition) => {
			transition.start();
		});
		setTimeout(() => {
			assert.equal(0, Transition.all().length);

			events = {};
			done();
		}, 1050);
	});
});
