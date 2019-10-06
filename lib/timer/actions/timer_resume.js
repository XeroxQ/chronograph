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

			let id = Utils.generateId(ChronographType.TIMER, args.name);
			let timer = Chronograph.get(id);
			if (!timer) {
				timer = new Chronograph(id, args.name, time, args.unit);
				timer.setData('type', ChronographType.TIMER);

				let splits = Homey.ManagerSettings.get('timer_splits') || [];
				splits
					.filter(split => split.name == timer.getName())
					.forEach(split => {
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
