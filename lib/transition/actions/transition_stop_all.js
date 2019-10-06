const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TransitionStopAll extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener(args => {
			Chronograph.all().forEach(chronograph => {
				if (chronograph.getData('type') == ChronographType.TRANSITION) {
					chronograph.stop();
				}
			});

			return Promise.resolve(true);
		});
	}
}

module.exports = TransitionStopAll;
