const fs = require("fs");
const remote = require("electron").remote;
const { dialog, shell } = remote;
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

let saveTimeout;

{ // create event handlers
	editor.on("load", () => {
		updateWorkspace();
	});

	editor.on("error", (message, e) => {
		console.error(`${message}\n\t${e}`);
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

		editor.emit("load");
	});
}

function setTitle(title) {
	document.title = `${title} - ${application.name}`;
	components.title.innerText = `${title} - ${application.name}`;
}

function updateWorkspace() {
	editor.workspaceName = editor.workspaceDir != "" ? editor.workspaceDir.split("\\")[editor.workspaceDir.split("\\").length - 1] : editor.workspaceName;
	updateSidebar();
	updateEditor();
	updateDialog();
	
	generateMenu({
		File: spawnContext,
		Edit: spawnContext,
		View: spawnContext,
		Tools: spawnContext,
		Help: spawnContext,
	});

	setTitle(editor.workspaceName);
}

function updateSidebar() {
	if (editor.workspaceDir != "") components.sidebar.innerHTML = generateFilelist(editor.workspaceDir);
	components.sidebarTitle.onclick = () => shell.openItem(editor.workspaceDir);
	components.sidebarTitle.innerText = editor.workspaceName;
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

				case "blank": {
					components.editor.innerHTML = ``;
				} break;

				default: {
					components.editor.innerHTML = utilERRORTEMPLATE("404", "File Not Found; Internal Error");
				}
			}
		} break;

		case "file": {
			components.editor.innerHTML = "";

			let content = document.createElement("textarea");
			content.value = fs.readFileSync(location, "utf-8");

			content.style.background = "var(--color-primary)";
			content.style.color = "var(--color-font-primary)";
			content.style.margin = "0.5em";
			content.style.flex = "1";
			content.style.border = "none";
			content.style.outline = "none";

			content.oninput = () => {
				clearTimeout(saveTimeout);
				saveTimeout = setTimeout(() =>
					fs.writeFile(location, content.value, (e) => { if (e) editor.emit("error", "While Running Auto-Save", e) })
				, 500);
			}

			components.editor.appendChild(content);
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

function generateFilelist(p) {
	const path = p.endsWith("\\") ? p : p + "\\";
	let files = "";
	let folders = "";

	fs.readdirSync(path).forEach((f) => {
		let stats = fs.statSync(path + f);
		if (stats.isFile()) {
			let extension = f.split(".")[f.split(".").length - 1]; if (extension.includes(" ")) extension = "";
			files += `<div onclick='editor.open = "file:${path.replace(/\\/g, "\\\\")}${f}"; updateEditor()'`;
			files += ` class="${extension == "" ? "" : "file-extension-" + extension}"`;
			files += `>${f}</div>`;
		} else
			folders += `<div class="folder">${f}</div>`;
	});

	return `${folders}\n${files}`;
}

function spawnContext(menu) {
	// spawn context menu at cursor position
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

function openProject(p = undefined) {
	if (p) {
		open(p);
	} else {
		dialog.showOpenDialog({
			title: "Select Project/Directory",
			message: "Select Project/Directory", // macOS
			properties: [
				"openDirectory",
				"createDirectory" // macOS
			]
		}, (path) => {
			if (!path) return;
			open(path[0]);
		});
	}

	function open(path) {
		if (fs.existsSync(path)) {
			editor.workspaceDir = path;
			editor.open = "cide:blank";
			updateWorkspace();
		} else {
			console.error("oh no the thing doesn't do\nyou should really tell the user that it didn't\nmaybe in the form of a dialog\n\n...just a thought...");
		}
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
