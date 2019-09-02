const Homey = require('homey');
const Timer = require('../timer.js');

class TimerSplit extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		var self = this;

		this.register();
		this.registerRunListener((args, state) => {
			var id = Timer.generateId(args.name);
			return Promise.resolve(
				id == state.timerId
				&& args.time == state.time
				&& args.unit == state.unit);
		});

		// This method gets called everytime a flow is saved that has (or had) this
		// trigger card. The argument values contains an array with objects, one for
		// each instance of this trigger card.
		this.on('update', () => {
			self.getArgumentValues().then(args => {
				// The only thing we can do with the arguments here is storing
				// them for retrieval once a timer is started.
				Homey.ManagerSettings.set('timer_splits', args);
			});
		});
	}
}

module.exports = TimerSplit;
