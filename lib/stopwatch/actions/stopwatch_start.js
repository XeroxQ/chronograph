const Homey = require('homey');
const Chronograph = require('../../chronograph.js');
const { Utils, ChronographType } = require('../../utils.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			if (!Utils.validateName(args.name)) {
				return Promise.reject(new Error(Homey.__("invalid_name")));
			}

			let id = Utils.generateId(ChronographType.STOPWATCH, args.name);
			let stopwatch = new Chronograph(id, args.name);
			stopwatch.setData('type', ChronographType.STOPWATCH);

			let splits = Homey.ManagerSettings.get('stopwatch_splits') || [];
			splits
				.filter(split => {
					if (split.name.includes('*')) {
						let regexp = Utils.wildcardToRegExp(split.name);
						return regexp.test(stopwatch.getName());
					} else {
						return split.name == stopwatch.getName();
					}
				})
				.forEach(split => stopwatch.addSplit(split.time, split.unit, split));

			stopwatch.start();

			return Promise.resolve(true);
		});

		this.on('update', this._storeCards.bind(this));

		this._storeCards();
	}

	_storeCards() {
		this.getArgumentValues().then(args => {
			Homey.ManagerSettings.set('stopwatch_start_cards', args);
			Chronograph.events.emit('stopwatch_start_cards_updated', args);
		});
	}
}

module.exports = StopwatchStart;
