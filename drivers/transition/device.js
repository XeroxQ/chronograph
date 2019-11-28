'use strict';

const Homey = require('homey');
const Chronograph = require('../../lib/chronograph.js');
const { Utils, ChronographType } = require('../../lib/utils.js');

class TransitionDevice extends Homey.Device {
	onInit() {
		this.registerCapabilityListener('button.pause', () => {
			let transition = Chronograph.get(this.getData().id);
			if (transition) {
				if (transition.isRunning()) {
					transition.pause();

				} else {
					transition.resume();
				}
			}
			return Promise.resolve();
		});

		this.registerCapabilityListener('button.stop', () => {
			let transition = Chronograph.get(this.getData().id);
			if (transition) {
				transition.stop();
			}
			return Promise.resolve();
		});

		this._transitionEventHandlers = Chronograph.events.mon([ 'started', 'resumed', 'paused', 'removed', 'updated' ], (event, transition) => {
			if (transition.getId() == this.getData().id) {
				this.setCapabilityValue('alarm_started', event != 'removed');
				if (
					event == 'started'
					|| event == 'resumed'
				) {
					this._updateInterval = setInterval(() => {
						this.setCapabilityValue('duration', parseFloat((transition.getDuration() / 1e3).toFixed(1)));
					}, 100);
				}
				if (
					event == 'paused'
					|| event == 'removed'
				) {
					clearInterval(this._updateInterval);
					this.setCapabilityValue('duration', event != 'removed' ? parseFloat((transition.getDuration() / 1e3).toFixed(2)) : NaN);
				}
			}
		});

		this._cardsEventHandlers = Chronograph.events.mon([ 'transition_start_cards_updated', 'transition_resume_cards_updated' ], (event, cards) => {
			let ids = []
				.concat(
					Homey.ManagerSettings.get('transition_start_cards') || [],
					Homey.ManagerSettings.get('transition_resume_cards') || []
				)
				.map(transition => Utils.generateId(ChronographType.TRANSITION, transition.name))
			;

			if (ids.includes(this.getData().id)) {
				this.setAvailable();
			} else {
				this.setUnavailable();
			}
		});

		this.log('Transition device initialized.');
	}

	onDeleted() {
		Object.keys(this._transitionEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._transitionEventHandlers[event]);
		});
		Object.keys(this._cardsEventHandlers).forEach(event => {
			Chronograph.events.removeListener(event, this._cardsEventHandlers[event]);
		});

		this.log('Transition device removed.');
	}
}

module.exports = TransitionDevice;
