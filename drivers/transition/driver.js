'use strict';

const Homey = require('homey');
const { Utils, ChronographType } = require('../../lib/utils.js');

class TransitionDriver extends Homey.Driver {
	onPairListDevices(data, callback) {
		let transitionStartCards = Homey.ManagerSettings.get('transition_start_cards') || [];
		let transitionResumeCards = Homey.ManagerSettings.get('transition_resume_cards') || [];
		let names =
			[].concat(transitionStartCards, transitionResumeCards)
			.map(transition => transition.name)
			.filter((name, index, self) => self.indexOf(name) === index)
			.sort();

		callback(null, names.map(name => ({
			name: Utils.beautifyName(name),
			data: {
				id: Utils.generateId(ChronographType.TRANSITION, name)
			}
		})));
	}
}

module.exports = TransitionDriver;
