const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class TimerResume extends Homey.FlowCardAction {
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

			let timer = Chronograph.get(ChronographType.TIMER, args.name);
			if (!timer) {
				timer = new Chronograph(ChronographType.TIMER, args.name, time, args.unit);

				let splits = Homey.ManagerSettings.get('timer_splits') || [];
				splits.forEach(split => {
					let reversedSplit = timer.getTargetDuration() - Utils.calculateDuration(split.time, split.unit);
					timer.addSplit(reversedSplit, 'milliseconds', split);
				});
	
				timer.start();
			} else {
				if (!timer.isRunning()) {
					timer.resume();
				}
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerResume;
