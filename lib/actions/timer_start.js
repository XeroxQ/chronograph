const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (
				isNaN(time) ||
				time <= 0
			) {
				return Promise.reject(new Error(Homey.__('invalid_duration')));
			}

			let id = Timer.generateId(args.name);
			new Timer(id, args.name, time, args.unit);

			let timersActive = Homey.ManagerSettings.get('timers_active') || {};
			timersActive[id] = { id: id, name: args.name, time: time, unit: args.unit, started: (new Date()).getTime() };
			Homey.ManagerSettings.set('timers_active', timersActive);

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
