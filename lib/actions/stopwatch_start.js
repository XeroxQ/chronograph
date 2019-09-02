const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Stopwatch.generateId(args.name);
			new Stopwatch(id, args.name);

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStart;
