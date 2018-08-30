const EventEmitter = require("events");

const AppEmitter = new class extends EventEmitter {}();

module.exports = exports = {
	name: "CIDE",
	on: AppEmitter.on,
	emit: AppEmitter.emit
};
