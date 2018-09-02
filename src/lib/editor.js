const EventEmitter = require("events");

const EditorEmitter = new class extends EventEmitter {}();

module.exports = exports = {
	workspaceName: "Welcome",
	workspaceDir: "",
	open: "cide:Welcome",
	on: EditorEmitter.on,
	emit: EditorEmitter.emit
};
