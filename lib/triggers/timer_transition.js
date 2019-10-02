const Homey = require('homey');
const Timer = require('../timer.js');
const { Utils, SplitTypes } = require('../utils.js');

class TimerTransition extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(
				Timer.generateId(args.name) == state.timerId
				&& args.time == state.time
				&& args.unit == state.unit
				&& args.start == state.start
				&& args.end == state.end);
		});

		// Listen for timer split events that should trigger this card.
		Timer.events.on('split', (timer, transition) => {
			if (transition.data.type != SplitTypes.TRANSITION) {
				return;
			}

			// Calculate the transition value.
			let split = Utils.calculateDuration(transition.time, transition.unit);
			let range = transition.data.end - transition.data.start;
			let perc = (1 / transition.data.duration) * split;
			let value = +(transition.data.end - (perc * range)).toFixed(3);

			// The first and last transition step is hard coded to provide the exact
			// card value to the flow.
			if (split == transition.data.duration) {
				value = transition.data.start;
			} else if (transition.time == 0) {
				value = transition.data.end;
			}

			this.trigger({
				// Tokens.
				"name": timer.getName(),
				"seconds": Math.round(timer.getDuration() / 1e1) / 1e2,
				"value": value
			}, {
				// State.
				"timerId": timer.getId(),
				"time": transition.data.time,
				"unit": transition.data.unit,
				"start": transition.data.start,
				"end": transition.data.end
			}, () => {
				// Callback.
			});
		});

		// This method gets called everytime a flow is saved that has (or had) this
		// trigger card. The argument values contains an array with objects, one for
		// each instance of this trigger card.
		this.on('update', () => {
			this.getArgumentValues().then(args => {
				// The only thing we can do with the arguments here is storing
				// them for retrieval once a timer is started.
				Homey.ManagerSettings.set('timer_transitions', args);
			});
		});
	}
}

module.exports = TimerTransition;
