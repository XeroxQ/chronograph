const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Stopwatch.generateId(args.name);
			new Stopwatch(id, args.name);

			let stopwatchesActive = Homey.ManagerSettings.get('stopwatches_active') || {};
			stopwatchesActive[id] = { id: id, name: args.name, started: (new Date()).getTime() };
			Homey.ManagerSettings.set('stopwatches_active', stopwatchesActive);

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStart;
