const Homey = require('homey');
const { Utils } = require('../../utils.js');

class DelayPassed extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let duration = Utils.calculateDuration(time, args.unit);



			return new Promise(resolve => setTimeout(() => resolve(true), duration));

		});
	}
}

module.exports = DelayPassed;
