const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TransitionRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener(args => {
			let id = Utils.generateId(ChronographType.TRANSITION, args.name);
			let transition = Chronograph.get(id, args.name);
			return Promise.resolve(!!transition && transition.isRunning());
		});
	}
}

module.exports = TransitionRunning;
