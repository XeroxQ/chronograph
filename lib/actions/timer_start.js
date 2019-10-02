const Homey = require('homey');
const Timer = require('../timer.js');
const { Utils, SplitTypes } = require('../utils.js');

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

			let timer = new Timer(args.name, time, args.unit);

			let splits = Homey.ManagerSettings.get('timer_splits') || [];
			splits.forEach(split => {
				split.type = SplitTypes.SPLIT;
				timer.addSplit(split.time, split.unit, split);
			});

			let transitions = Homey.ManagerSettings.get('timer_transitions') || [];
			transitions.forEach(transition => {
				transition.type = SplitTypes.TRANSITION;
				transition.duration = timer.getDuration();
				let split = timer.getDuration();
				let step = Utils.calculateDuration(transition.time, transition.unit);
				while (split > 0) {
					timer.addSplit(split / 1e3, 'seconds', transition);
					split -= step;
				}
				timer.addSplit(0, 'seconds', transition);
			});

			timer.start();

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
