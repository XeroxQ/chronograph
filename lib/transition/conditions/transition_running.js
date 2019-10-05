const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TransitionRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener(args => {
			let transition = Chronograph.get(ChronographType.TRANSITION, args.name);
			return Promise.resolve(!!transition && transition.isRunning());
		});
	}
}

module.exports = TransitionRunning;
