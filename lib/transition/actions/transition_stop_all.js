const Homey = require('homey');
const Transition = require('../transition.js');

class TransitionStopAll extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			Transition.all().forEach((transition) => {
				transition.stop();
			});

			return Promise.resolve(true);
		});
	}
}

module.exports = TransitionStopAll;
