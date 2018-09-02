const fs = require("fs");
const remote = require("electron").remote;
const { dialog } = remote;
const w = remote.getCurrentWindow();
const application = require("./lib/application");
const editor = require("./lib/editor");
const components = {
	title: document.getElementById("title"),
	altmenu: document.getElementById("altmenu"),
	sidebarHandle: document.getElementById("sidebar"),
	sidebarTitle: document.getElementById("sidebar-workspace"),
	sidebar: document.getElementById("sidebar-content"),
	editor: document.getElementById("editor"),
	panel: document.getElementById("panel"),
	dialogContainer: document.getElementById("dialog"),
	minimizeApp: document.getElementById("action-minimize"),
	maximizeApp: document.getElementById("action-maximize"),
	closeApp: document.getElementById("action-close")
};

const dialogs = {
	newApp: {
		console() { /* placeholder function */ }
	}
}

{ // create event handlers
	editor.on("load", () => {
		updateWorkspace();
	});

	application.on("load", () => {
		{ // shortcuts
			// [GET SHORTCUT CONFIG AND ASSIGN ACTIONS]
		}

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
	updateSidebar();
	updateEditor();
	updateDialog();
	setTitle(editor.workspace);
}

function updateSidebar() {
	components.sidebarTitle.innerText = editor.workspace;
}

function updateEditor() {
	let protocol = editor.open.split(":")[0];
	let location = editor.open.split(":"); location.shift(); location = location.join(":");
	components.editor.innerHTML = "";

	switch (protocol) {
		case "cide": {
			switch (location) {
				case "Welcome": {
					components.editor.innerHTML = `
						<div style="padding: 10vh 10vw; flex: 1; display: flex; flex-direction: column;">
							<div style="font-size: 3em; font-weight: bold; color: var(--color-font-primary);">Welcome!</div>
							<div style="font-size: 0.8em; color: var(--color-font-secondary);">CIDE, Clink++ Integrated Development Enviroment</div>
							<div class="filelist no-icons">
								<div onclick="showDialog(dialogs.newApp.console())">New Console App...</div>
								<div disabled>New Forms App...</div>
								<div onclick="openProject()">Open Project...</div>
							</div>
						</div>
					`;
				} break;

				default: {
					components.editor.innerHTML = utilERRORTEMPLATE("404", "File Not Found; Internal Error");
				}
			}
		} break;

		case "file": {

		} break;

		default: {
			components.editor.innerHTML = utilERRORTEMPLATE("-1", "Bad Request; Invalid Protocol");
		}
	}
}

function showDialog(dialog) {
	if (dialog != "") components.dialogContainer.innerHTML = dialog;
	updateDialog();
}

function hideDialog() {
	components.dialogContainer.innerHTML = "";
	updateDialog();
}

function updateDialog() {
	if (components.dialogContainer.innerHTML == "") {
		components.dialogContainer.classList.add("hidden");
	} else {
		components.dialogContainer.classList.remove("hidden");
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

function utilDIALOGTEMPLATE(body) {
	if (typeof body == "string") {
		return `<div class="dialog>${body}</div>`;
	} else {
		let outer = document.createElement("div");
		outer.classList.add("dialog");
		outer.appendChild(body);
	}
}

function utilERRORTEMPLATE(code = "404", details = "Missing File") {
	return `
		<div style="padding: 10vh 10vw; flex: 1; display: flex; flex-direction: column;">
			<div style="font-size: 3em; font-weight: bold; color: #f44336;">error ${code}</div>
			<div style="font-size: 1em; color: var(--color-font-primary);">${details.toLowerCase()}</div>
			<div style="font-size: 0.8em; color: var(--color-font-secondary);">if you do not know how this error occured, ask on the <a href="https://${application.repo}/issues">GitHub issues page</a>.</div>
		</div>
	`;
}

// begin
application.emit("load");
