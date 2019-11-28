'use strict';

const Homey = require('homey');
const Chronograph = require('../../lib/chronograph.js');
const { Utils, ChronographType } = require('../../lib/utils.js');

class TimerDevice extends Homey.Device {
	onInit() {
		this.registerCapabilityListener('button.pause', () => {
			let timer = Chronograph.get(this.getData().id);
			if (timer) {
				if (timer.isRunning()) {
					timer.pause();

				} else {
					timer.resume();
				}
			}
			return Promise.resolve();
		});

		this.registerCapabilityListener('button.stop', () => {
			let timer = Chronograph.get(this.getData().id);
			if (timer) {
				timer.stop();
			}
			return Promise.resolve();
		});

		this._timerEventHandlers = Chronograph.events.mon([ 'started', 'resumed', 'paused', 'removed', 'updated' ], (event, timer) => {
			if (timer.getId() == this.getData().id) {
				this.setCapabilityValue('alarm_started', event != 'removed');
				if (
					event == 'started'
					|| event == 'resumed'
				) {
					this._updateInterval = setInterval(() => {
						this.setCapabilityValue('duration', parseFloat(((timer.getTargetDuration() - timer.getDuration()) / 1e3).toFixed(1)));
					}, 100);
				}
				if (
					event == 'paused'
					|| event == 'removed'
				) {
					clearInterval(this._updateInterval);
					this.setCapabilityValue('duration', event != 'removed' ? parseFloat(((timer.getTargetDuration() - timer.getDuration()) / 1e3).toFixed(2)) : NaN);
				}
			}
		});

		this._cardsEventHandlers = Chronograph.events.mon([ 'timer_start_cards_updated', 'timer_resume_cards_updated' ], (event, cards) => {
			let ids = []
				.concat(
					Homey.ManagerSettings.get('timer_start_cards') || [],
					Homey.ManagerSettings.get('timer_resume_cards') || []
				)
				.map(timer => Utils.generateId(ChronographType.TIMER, timer.name))
			;

			if (ids.includes(this.getData().id)) {
				this.setAvailable();
			} else {
				this.setUnavailable();
			}
		});

		this.log('Timer device initialized.');
	}

	onDeleted() {
		Object.keys(this._timerEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._timerEventHandlers[event]);
		});
		Object.keys(this._cardsEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._cardsEventHandlers[event]);
		});

		this.log('Timer device removed.');
	}
}

module.exports = TimerDevice;
