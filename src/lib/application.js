const EventEmitter = require("events");

const AppEmitter = new class extends EventEmitter {}();

module.exports = exports = {
	name: "CIDE",
	repo: "github.com/MininMobile/clinkplusplus-ide",
	on: AppEmitter.on,
	emit: AppEmitter.emit
};
