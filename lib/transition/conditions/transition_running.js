const Homey = require('homey');
const Transition = require('../transition.js');

class TransitionRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let transition = Transition.get(args.name);
			return Promise.resolve(!!transition && transition.isRunning());
		});
	}
}

module.exports = TransitionRunning;
