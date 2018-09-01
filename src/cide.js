const remote = require("electron").remote;
const w = remote.getCurrentWindow();
const application = require("./lib/application");
const editor = require("./lib/editor");
const components = {
	title: document.getElementById("title"),
	altmenu: document.getElementById("altmenu"),
	editor: document.getElementById("editor"),
	panel: document.getElementById("panel"),
	minimizeApp: document.getElementById("action-minimize"),
	maximizeApp: document.getElementById("action-maximize"),
	closeApp: document.getElementById("action-close")
};

{ // create event handlers
	editor.on("load", () => {
		updateWorkspace();
	});

	application.on("load", () => {
		{ // action buttons
			components.minimizeApp.onclick = () => w.minimize();
			components.maximizeApp.onclick = () => toggleMaximize();
			components.closeApp.onclick = () => window.close();
		}
		
		{ // init
			generateMenu({
				File: undefined,
				Edit: undefined,
				View: undefined,
				Tools: undefined,
				Help: undefined,
			});
		}

		editor.emit("load");
	});
}

function setTitle(title) {
	document.title = `${title} - ${application.name}`;
	components.title.innerText = `${title} - ${application.name}`;
}

function updateWorkspace() {
	// update variables();
	// update sidebar();
	updateEditor();
	setTitle(editor.workspace);
}

function updateEditor() {
	let protocol = editor.open.split(":")[0];
	let location = editor.open.split(":"); location.shift(); location.join(":");
	components.editor.innerHTML = "";

	switch (protocol) {
		case "cide": {

		} break;

		case "file": {

		} break;

		default: {
			components.editor.innerHTML = utilERRORTEMPLATE("-1", "Bad Request; Invalid Protocol");
		}
	}
}

function generateMenu(menu) {
	components.altmenu.innerHTML = "";

	Object.keys(menu).forEach((item) => {
		let button = document.createElement("div");
		button.classList.add("menu-item", "button-small");
		button.innerText = item;
		button.onclick = menu[item];

		components.altmenu.appendChild(button);
	});
}

function toggleMaximize() {
	if (w.isMaximized()) {
		components.maximizeApp.classList.add("button-maximize");
		components.maximizeApp.classList.remove("button-maximized");
		w.unmaximize();
	} else {
		components.maximizeApp.classList.add("button-maximized");
		components.maximizeApp.classList.remove("button-maximize");
		w.maximize();
	}
}

function utilERRORTEMPLATE(code = "404", details = "Missing File") {
	return `
		<div style="padding: 10vh 10vw; flex: 1; display: flex; flex-direction: column;">
			<div style="font-size: 3em; font-weight: bold; color: #f44336;">error ${code}</div>
			<div style="font-size: 1em; color: var(--color-font-primary);">${details.toLowerCase()}</div>
			<div style="font-size: 1em; color: var(--color-font-secondary);">if you do not know how this error occured, ask on the <a href="https://${application.repo}/issues">GitHub issues page</a>.</div>
		</div>
	`;
}

// begin
application.emit("load");
