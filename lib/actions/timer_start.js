'use strict';

const Homey = require('homey');
const Timer = require('../timer.js');
const { Utils } = require('../utils.js');

class TimerStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = Utils.evalTime(args.time);
			if (
				isNaN(time) ||
				time <= 0
			) {
				return Promise.reject(new Error(Homey.__('invalid_duration')));
			}

			let timer = new Timer(args.name, time, args.unit);

			let splits = Homey.ManagerSettings.get('timer_splits') || [];
			splits.forEach(split => timer.addSplit(split.time, split.unit, split));

			timer.start();

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
