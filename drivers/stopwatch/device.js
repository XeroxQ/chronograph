'use strict';

const Homey = require('homey');
const Chronograph = require('../../lib/chronograph.js');
const { Utils, ChronographType } = require('../../lib/utils.js');

class StopwatchDevice extends Homey.Device {
	onInit() {
		this.registerCapabilityListener('button.pause', () => {
			let stopwatch = Chronograph.get(this.getData().id);
			if (stopwatch) {
				if (stopwatch.isRunning()) {
					stopwatch.pause();

				} else {
					stopwatch.resume();
				}
			}
			return Promise.resolve();
		});

		this.registerCapabilityListener('button.stop', () => {
			let stopwatch = Chronograph.get(this.getData().id);
			if (stopwatch) {
				stopwatch.stop();
			}
			return Promise.resolve();
		});

		this._stopwatchEventHandlers = Chronograph.events.mon([ 'started', 'resumed', 'paused', 'removed', 'updated' ], (event, stopwatch) => {
			if (stopwatch.getId() == this.getData().id) {
				this.setCapabilityValue('alarm_started', event != 'removed');
				if (
					event == 'started'
					|| event == 'resumed'
				) {
					this._updateInterval = setInterval(() => {
						this.setCapabilityValue('duration', parseFloat((stopwatch.getDuration() / 1e3).toFixed(1)));
					}, 100);
				}
				if (
					event == 'paused'
					|| event == 'removed'
				) {
					clearInterval(this._updateInterval);
					this.setCapabilityValue('duration', event != 'removed' ? parseFloat((stopwatch.getDuration() / 1e3).toFixed(2)) : NaN);
				}
			}
		});

		this._cardsEventHandlers = Chronograph.events.mon([ 'stopwatch_start_cards_updated', 'stopwatch_resume_cards_updated' ], (event, cards) => {
			let ids = []
				.concat(
					Homey.ManagerSettings.get('stopwatch_start_cards') || [],
					Homey.ManagerSettings.get('stopwatch_resume_cards') || []
				)
				.map(stopwatch => Utils.generateId(ChronographType.STOPWATCH, stopwatch.name))
			;

			if (ids.includes(this.getData().id)) {
				this.setAvailable();
			} else {
				this.setUnavailable();
			}
		});

		this.log('Stopwatch device initialized.');
	}

	onDeleted() {
		Object.keys(this._stopwatchEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._stopwatchEventHandlers[event]);
		});
		Object.keys(this._cardsEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._cardsEventHandlers[event]);
		});

		this.log('Stopwatch device removed.');
	}
}

module.exports = StopwatchDevice;
