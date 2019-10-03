'use strict';

const assert = require('assert');
const Stopwatch = require('../lib/stopwatch/stopwatch.js');

Stopwatch.events.on('log', (stopwatch, text) => {
//	console.log('[' + stopwatch.getName() + '] ' + text);
});

let events = {};
Stopwatch.events.on('created', (stopwatch) => events.created = stopwatch);
Stopwatch.events.on('updated', (stopwatch) => events.updated = stopwatch);
Stopwatch.events.on('started', (stopwatch) => events.started = stopwatch);
Stopwatch.events.on('paused', (stopwatch) => events.paused = stopwatch);
Stopwatch.events.on('resumed', (stopwatch) => events.resumed = stopwatch);
Stopwatch.events.on('stopped', (stopwatch) => events.stopped = stopwatch);
Stopwatch.events.on('removed', (stopwatch) => events.removed = stopwatch);
Stopwatch.events.on('split', () => events.split = !!events.split ? events.split + 1 : 1);

describe('Stopwatch', () => {
	it('should be properly initialized', function() {
		let name = 'test stopwatch 1';
		let stopwatch = new Stopwatch(name);
		assert.ok(!!Stopwatch.get(name), 'stopwatch should be in global stopwatches array');
		assert.ok(!stopwatch.isRunning(), 'new stopwatch should not be running');
		assert.ok(!!events.created, 'created event should be emitted');
		assert.equal(stopwatch, events.created, 'created event should emit correct stopwatch');

		stopwatch = new Stopwatch(name);
		assert.ok(!stopwatch.isRunning(), 'new stopwatch should not be running');
		assert.ok(!!events.updated, 'updated event should be emitted');
		assert.equal(stopwatch, events.updated, 'updated event should emit correct stopwatch');
		stopwatch.stop();
		stopwatch.stop(); // second stop should do nothing
		assert.ok(!Stopwatch.get(name), 'stopwatch should not be in global stopwatches array');

		events = {};
	});

	it('should start a stopwatch and read duration in ms', function(done) {
		this.timeout(450); // the entire test should not exceed this timeout

		let name = 'test stopwatch 2';
		let stopwatch = new Stopwatch(name);
		assert.ok(!!Stopwatch.get(name), 'stopwatch should be in global stopwatches array');
		stopwatch.start();
		stopwatch.start(); // second start should do nothing
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(stopwatch, events.started, 'started event should emit correct stopwatch');
		assert.ok(stopwatch.isRunning(), 'new stopwatch should be running');
		setTimeout(() => {
			assert.ok(stopwatch.getDuration() > 350 && stopwatch.getDuration() < 450, 'stopwatch should running at the correct position');
			stopwatch.stop();

			events = {};
			done();
		}, 400);
	});

	it('should start and stop a stopwatch', function(done) {
		this.timeout(1250); // the entire test should not exceed this timeout

		let name = 'test stopwatch 3';
		let stopwatch = new Stopwatch(name);
		assert.ok(!!Stopwatch.get(name), 'stopwatch should be in global stopwatches array');
		stopwatch.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(stopwatch, events.started, 'started event should emit correct stopwatch');

		setTimeout(() => {
			stopwatch.stop();
			assert.ok(!Stopwatch.get(name), 'stopwatch should not be in global stopwatches array after stopping');
			assert.ok(stopwatch.getDuration() > 150 && stopwatch.getDuration() < 250, 'stopwatch should be stopped at the correct position');
			assert.ok(!stopwatch.isRunning(), 'stopped stopwatch should not be running');
			assert.ok(!!events.stopped, 'stopped event should be emitted');
			assert.equal(stopwatch, events.stopped, 'stopped event should emit correct stopwatch');

			setTimeout(() => {
				assert.ok(!events.split, 'split event should not be emitted');
				assert.ok(!events.paused, 'paused event should not be emitted');
				assert.ok(!events.resumed, 'resumed event should not be emitted');
	
				events = {};
				done();
			}, 1000); // stopped
		}, 200); // running
	});

	it('should start, pause and resume a stopwatch', function(done) {
		this.timeout(3050); // the entire test should not exceed this timeout

		let name = 'test stopwatch 4';
		let stopwatch = new Stopwatch(name);
		assert.ok(!!Stopwatch.get(name), 'stopwatch should be in global stopwatches array');
		stopwatch.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(stopwatch, events.started, 'started event should emit correct stopwatch');

		setTimeout(() => {
			assert.ok(stopwatch.isRunning(), 'stopwatch should be running');
			stopwatch.pause();
			assert.ok(!stopwatch.isRunning(), 'paused stopwatch should not be running');
			assert.ok(!!Stopwatch.get(name), 'stopwatch should still be in global stopwatches array after pause');
			assert.ok(stopwatch.getDuration() > 450 && stopwatch.getDuration() < 550, 'stopwatch should stopped at the correct position');
			assert.ok(!!events.paused, 'paused event should be emitted');
			assert.equal(stopwatch, events.paused, 'paused event should emit correct stopwatch');

			setTimeout(() => {
				assert.ok(stopwatch.getDuration() > 450 && stopwatch.getDuration() < 550, 'stopwatch should not moved when paused');
				stopwatch.resume();
				assert.ok(!!Stopwatch.get(name), 'stopwatch should still be in global stopwatches array after resume');
				assert.ok(stopwatch.isRunning(), 'stopwatch should be running');
				assert.ok(!!events.resumed, 'resumed event should be emitted');
				assert.equal(stopwatch, events.resumed, 'resumed event should emit correct stopwatch');
		
				setTimeout(() => {
					assert.ok(stopwatch.getDuration() > 950 && stopwatch.getDuration() < 1050, 'stopwatch duration should be correct while running');
					stopwatch.pause();
					assert.ok(stopwatch.getDuration() > 950 && stopwatch.getDuration() < 1050, 'stopwatch duration should be correct while paused');
					assert.ok(!stopwatch.isRunning(), 'paused stopwatch should not be running');
					assert.ok(!!Stopwatch.get(name), 'stopwatch should still be in global stopwatches array after pause');
					stopwatch.resume();

					setTimeout(() => {
						assert.ok(stopwatch.getDuration() > 1950 && stopwatch.getDuration() < 2050, 'stopwatch duration should be correct while paused');
						stopwatch.stop();

						events = {};
						done();
					}, 1000); // running
				}, 500); // running
			}, 1000); // paused
		}, 500); // running
	});

	it('should start, pause and stop a stopwatch', function(done) {
		this.timeout(250); // the entire test should not exceed this timeout

		let name = 'test stopwatch 5';
		let stopwatch = new Stopwatch(name);
		assert.ok(!!Stopwatch.get(name), 'stopwatch should be in global stopwatches array');
		stopwatch.start();
		assert.ok(!!events.started, 'started event should be emitted');
		assert.equal(stopwatch, events.started, 'started event should emit correct stopwatch');

		setTimeout(() => {
			assert.ok(stopwatch.isRunning(), 'stopwatch should be running');
			stopwatch.pause();
			assert.ok(!stopwatch.isRunning(), 'paused stopwatch should not be running');
			assert.ok(stopwatch.getDuration() > 50 && stopwatch.getDuration() < 150, 'stopwatch should be paused at the correct position');
			assert.ok(!!events.paused, 'paused event should be emitted');
			assert.equal(stopwatch, events.paused, 'paused event should emit correct stopwatch');

			setTimeout(() => {
				assert.ok(!stopwatch.isRunning(), 'paused stopwatch should not be running');
				stopwatch.stop();
				assert.ok(!Stopwatch.get(name), 'stopwatch should not be in global stopwatchs array after stopping');
				assert.ok(stopwatch.getDuration() > 50 && stopwatch.getDuration() < 150, 'stopwatch should be stopped at the correct position');
				assert.ok(!stopwatch.isRunning(), 'stopped stopwatch should not be running');
				assert.ok(!!events.stopped, 'stopped event should be emitted');
				assert.equal(stopwatch, events.stopped, 'stopped event should emit correct stopwatch');

				events = {};
				done();
			}, 100); // paused
		}, 100); // running
	});

	it('should start, split, pause, split and stop a stopwatch', function(done) {
		this.timeout(2600); // the entire test should not exceed this timeout

		let name = 'test stopwatch 6';
		let stopwatch = new Stopwatch(name);
		assert.ok(!!Stopwatch.get(name), 'stopwatch should be in global stopwatches array');
		stopwatch.addSplit(0.1, 'seconds');
		stopwatch.addSplit(0.2, 'seconds');
		stopwatch.addSplit(0.3, 'seconds');
		stopwatch.addSplit(0.6, 'seconds');
		stopwatch.addSplit(0.8, 'seconds');
		stopwatch.addSplit(1.1, 'seconds');
		stopwatch.start();

		setTimeout(() => {
			assert.ok(stopwatch.isRunning(), 'stopwatch should be running');
			stopwatch.pause();
			assert.ok(!stopwatch.isRunning(), 'paused stopwatch should not be running');
			assert.equal(2, events.split, 'two split events should be emitted')

			setTimeout(() => {
				assert.equal(2, events.split, 'splits should be paused too')
				stopwatch.resume();

				setTimeout(() => {
					assert.equal(3, events.split, 'third split should come in the correct time')
					stopwatch.stop();

					setTimeout(() => {
						assert.equal(3, events.split, 'splits should be stopped too')
						assert.ok(stopwatch.getDuration() > 300 && stopwatch.getDuration() < 400, 'stopwatch should be stopped at the correct position');
						assert.ok(!stopwatch.isRunning(), 'stopped stopwatch should not be running');
		
						events = {};
						done();
					}, 1000); // stopped
				}, 100); // running
			}, 1200); // paused
		}, 250); // running
	});

	it('should start, split, pause, adjust, start, adjust and split a stopwatch', function(done) {
		this.timeout(4150); // the entire test should not exceed this timeout

		let name = 'test stopwatch 7';
		let stopwatch = new Stopwatch(name);
		assert.ok(!!Stopwatch.get(name), 'stopwatch should be in global stopwatches array');
		stopwatch.addSplit(3599.5, 'seconds');
		stopwatch.addSplit(0.5, 'seconds');
		stopwatch.addSplit(0.7, 'seconds');
		stopwatch.start();

		setTimeout(() => {
			assert.ok(stopwatch.isRunning(), 'stopwatch should be running');
			stopwatch.pause();
			assert.ok(!stopwatch.isRunning(), 'paused stopwatch should not be running');
			assert.equal(1, events.split, 'one split events should be emitted')
			stopwatch.adjust(0.2, 'seconds'); // B)
			assert.ok(!stopwatch.isRunning(), 'adjusted stopwatch should not be running');

			setTimeout(() => {
				assert.equal(1, events.split, 'one split events should be emitted')
				stopwatch.resume();

				events = {};
				setTimeout(() => {
					stopwatch.adjust(-1.8, 'seconds'); // A) + B) + C)

					setTimeout(() => {
						assert.equal(2, events.split, 'two split events should be emitted')
						stopwatch.adjust(3598.6, 'seconds');

						setTimeout(() => {
							assert.equal(2, events.split, 'two split events should be emitted')
							assert.ok(!events.paused, 'paused event should not be emitted');
							assert.ok(!events.resumed, 'paused event should not be emitted');
							assert.ok(!events.stopped, 'stopped event should not be emitted');
							stopwatch.stop();

							events = {};
							done();
						}, 500); // running
					}, 1000); // running
				}, 1000); // running C)
			}, 1000); // paused
		}, 600); // running A)
	});

	it('should allow for multiple stopwatches at once', function(done) {
		for (var i = 1; i <= 50; i++) {
			new Stopwatch('bulk stopwatch ' + i, Math.random(), 'seconds');
		}
		assert.equal(50, Stopwatch.all().length);
		Stopwatch.all().forEach((stopwatch) => {
			stopwatch.start();
		});
		setTimeout(() => {
			assert.equal(50, Stopwatch.all().length);
			Stopwatch.all().forEach((stopwatch) => {
				stopwatch.stop();
			});
			assert.equal(0, Stopwatch.all().length);
	
			events = {};
			done();
		}, 1050);
	});
});
