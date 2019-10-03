'use strict';

const Homey = require('homey');
const Transition = require('../transition.js');
const { Utils } = require('../utils.js');

class TransitionStart extends Homey.FlowCardAction {
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

			let from = parseFloat(args.from);
			let to = parseFloat(args.to);
			let steps = parseInt(args.steps);
			if (
				isNaN(from)
				|| isNaN(to)
				|| isNaN(steps)
				|| steps < 2
			) {
				return Promise.reject(new Error(Homey.__('invalid_transition')));
			}

			let transition = new Transition(args.name, time, args.unit, from, to, steps);
			transition.start();

			return Promise.resolve(true);
		});
	}
}

module.exports = TransitionStart;
