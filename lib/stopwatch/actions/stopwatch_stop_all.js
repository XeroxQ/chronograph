const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class StopwatchStopAll extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener(args => {
			Chronograph.all().forEach(chronograph => {
				if (chronograph.getPrefix() == ChronographType.STOPWATCH) {
					chronograph.stop();
				}
			});

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStopAll;
