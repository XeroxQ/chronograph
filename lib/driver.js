'use strict';

const Homey = require('homey');
const { Utils } = require('./utils.js');

class Driver extends Homey.Driver {
	onPairListDevices(data, callback) {
		let names =
			[].concat(this.getStartCards(), this.getResumeCards())
			.map(card => card.name)
			.filter((name, index, self) => self.indexOf(name) === index) // make unique
			.sort();

		callback(null, names.map(name => ({
			name: Utils.beautifyName(name),
			data: {
				id: Utils.generateId(this.getChronographType(), name)
			}
		})));
	}
}

module.exports = Driver;
