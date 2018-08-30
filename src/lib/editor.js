const EventEmitter = require("events");

const EditorEmitter = new class extends EventEmitter {}();

module.exports = exports = {
	workspace: "Welcome",
	workspaceid: -1,
	workspacefiles: { },
	openfiles: [ "cide:Welcome" ],
	on: EditorEmitter.on,
	emit: EditorEmitter.emit
};
