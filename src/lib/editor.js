const EventEmitter = require("events");

const EditorEmitter = new class extends EventEmitter {}();

module.exports = exports = {
	workspace: "Welcome",
	workspaceid: -1,
	workspacedir: "",
	workspacefiles: [ ],
	open: "cide:Welcome",
	on: EditorEmitter.on,
	emit: EditorEmitter.emit
};
