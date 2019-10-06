class Data {
	constructor() {
		this._data = {};
	}

	getData(key, defaultValue) {
		return key in this._data ? this._data[key] : defaultValue;
	}

	setData(key, value) {
		this._data[key] = value;
	}

	getAllData() {
		return this._data;
	}
}

module.exports = Data;
