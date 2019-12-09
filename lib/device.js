'use strict';

const Homey = require('homey');
const Chronograph = require('../../lib/chronograph.js');
const { Utils, ChronographType } = require('./utils.js');

class Device extends Homey.Device {
	onInit() {
		this.registerCapabilityListener('button.pause', () => {
			let chronograph = Chronograph.get(this.getData().id);
			if (chronograph) {
				if (chronograph.isRunning()) {
					chronograph.pause();

				} else {
					chronograph.resume();
				}
			}
			return Promise.resolve();
		});

		this.registerCapabilityListener('button.stop', () => {
			let chronograph = Chronograph.get(this.getData().id);
			if (chronograph) {
				chronograph.stop();
			}
			return Promise.resolve();
		});

		this._chronographEventHandlers = Chronograph.events.mon([ 'started', 'resumed', 'paused', 'removed', 'updated' ], (event, chronograph) => {
			if (chronograph.getId() == this.getData().id) {
				this.setCapabilityValue('alarm_started', event != 'removed');
				if (
					event == 'started'
					|| event == 'resumed'
				) {
					if (this._updateInterval) {
						clearInterval(this._updateInterval);
					}
					this._updateInterval = setInterval(() => {
						if (chronograph.getData('type') == ChronographType.TIMER) {
							this.setCapabilityValue('duration', parseFloat(((chronograph.getTargetDuration() - chronograph.getDuration()) / 1e3).toFixed(2)));
						} else {
							this.setCapabilityValue('duration', parseFloat((chronograph.getDuration() / 1e3).toFixed(2)));
						}
					}, 131);
				}
				if (
					event == 'paused'
					|| event == 'removed'
				) {
					clearInterval(this._updateInterval);
					delete(this._updateInterval);
					if (chronograph.getData('type') == ChronographType.TIMER) {
						this.setCapabilityValue('duration', event != 'removed' ? parseFloat(((chronograph.getTargetDuration() - chronograph.getDuration()) / 1e3).toFixed(2)) : NaN);
					} else {
						this.setCapabilityValue('duration', event != 'removed' ? parseFloat((chronograph.getDuration() / 1e3).toFixed(2)) : NaN);
					}
				}
			}
		});

		this._cardEventHandlers = Chronograph.events.mon([ 'start_cards_updated', 'resume_cards_updated' ], (event, cards) => {
			let ids =
				[].concat(this.getStartCards(), this.getResumeCards())
				.map(chronograph => Utils.generateId(this.getChronographType(), chronograph.name))
			;
			if (ids.includes(this.getData().id)) {
				this.setAvailable();
			} else {
				this.setUnavailable();
			}
		});

		this.log('Device initialized.');
	}

	onDeleted() {
		Object.keys(this._chronographEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._chronographEventHandlers[event]);
		});
		Object.keys(this._cardEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._cardEventHandlers[event]);
		});

		this.log('Device removed.');
	}
}

module.exports = Device;
