const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TransitionStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			if (!Utils.validateName(args.name)) {
				return Promise.reject(new Error(Homey.__("invalid_name")));
			}

			let time = Utils.evalTime(args.time);
			if (
				isNaN(time) ||
				time < 0
			) {
				return Promise.reject(new Error(Homey.__('invalid_duration')));
			}

			let from = parseFloat(args.from);
			let to = parseFloat(args.to);
			let steps = parseInt(args.steps);
			if (
				isNaN(from)
				|| isNaN(to)
				|| isNaN(steps)
				|| steps < 2
			) {
				return Promise.reject(new Error(Homey.__('invalid_transition')));
			}

			let id = Utils.generateId(ChronographType.TRANSITION, args.name);
			let transition = new Chronograph(id, args.name, time, args.unit);
			transition.setData('type', ChronographType.TRANSITION);
			transition.setData('from', from);
			transition.setData('to', to);

			steps = Math.min(Math.floor(transition.getTargetDuration() / 250), steps);
			transition.setData('steps', steps);

			steps--;
			if (steps >= 2) {
				let stepDuration = transition.getTargetDuration() / steps;
				if (stepDuration < 250) {
					return Promise.reject(new Error(Homey.__('invalid_transition')));
				}
				while(--steps > 0) {
					transition.addSplit(steps * stepDuration, 'milliseconds');
				}
			}

			transition.start();

			return Promise.resolve(true);
		});

		this.on('update', this._storeCards.bind(this));

		this._storeCards();
	}

	_storeCards() {
		this.getArgumentValues().then(args => {
			Homey.ManagerSettings.set('transition_start_cards', args);
			Chronograph.events.emit('transition_start_cards_updated', args);
		});
	}
}

module.exports = TransitionStart;
