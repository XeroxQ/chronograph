const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TimerFinished extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			if (args.name.includes('*')) {
				let regexp = Utils.wildcardToRegExp(args.name);
				return Promise.resolve(regexp.test(state.name));
			} else {
				return Promise.resolve(Utils.generateId(ChronographType.TIMER, args.name) == state.id);
			}
		});

		// Listen for chronograph finished events that should trigger this card.
		Chronograph.events.on('finished', chronograph => {
			if (chronograph.getData('type') != ChronographType.TIMER) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName()
			}, {
				// State.
				"id": chronograph.getId(),
				"name": chronograph.getName()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TimerFinished;
