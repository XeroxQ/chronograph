const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TransitionStopped extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			return Promise.resolve(Utils.generateId(ChronographType.TRANSITION, args.name) == state.transitionId);
		});

		// Listen for transition stopped events that should trigger this card.
		Chronograph.events.on('stopped', chronograph => {
			if (chronograph.getData('type') != ChronographType.TRANSITION) {
				return;
			}
			this.trigger({
				// Tokens.
				"name": chronograph.getName(),
				"seconds": Math.round(chronograph.getDuration() / 1e1) / 1e2
			}, {
				// State.
				"transitionId": chronograph.getId()
			}, () => {
				// Callback.
			});
		});
	}
}

module.exports = TransitionStopped;
