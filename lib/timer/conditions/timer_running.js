const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { ChronographType } = require('../../utils.js');

class TimerRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let timer = Chronograph.get(ChronographType.TIMER, args.name);
			return Promise.resolve(!!timer && timer.isRunning());
		});
	}
}

module.exports = TimerRunning;
