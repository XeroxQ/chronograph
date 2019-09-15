const Homey = require('homey');
const Timer = require('../timer.js');

class TimerSplit extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(
				Timer.generateId(args.name) == state.timerId
				&& args.time == state.time
				&& args.unit == state.unit);
		});

		// Listen for timer split events that should trigger this card.
		Timer.events.on('split', (timer, split) => {
			this.trigger({
				// Tokens.
				"name": timer.getName(),
				"seconds": Math.round(timer.getDuration() / 1e1) / 1e2
			}, {
				// State.
				"timerId": timer.getId(),
				"time": split.time,
				"unit": split.unit
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
				Homey.ManagerSettings.set('timer_splits', args);
			});
		});
	}
}

module.exports = TimerSplit;
