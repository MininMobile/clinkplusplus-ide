const remote = require("electron").remote;
const w = remote.getCurrentWindow();
const application = { name: "CIDE" }; // replace with require("./lib/application") soon pls
const components = {
	title: document.getElementById("title"),
	altmenu: document.getElementById("altmenu"),
	minimizeApp: document.getElementById("action-minimize"),
	maximizeApp: document.getElementById("action-maximize"),
	closeApp: document.getElementById("action-close")
};

{
	components.minimizeApp.onclick = w.minimize;
	components.maximizeApp.onclick = () => {
		if (w.isMaximized()) {
			components.maximizeApp.classList.add("button-maximize");
			components.maximizeApp.classList.remove("button-maximized");
			w.unmaximize();
		} else {
			components.maximizeApp.classList.add("button-maximized");
			components.maximizeApp.classList.remove("button-maximize");
			w.maximize();
		}
	};
	components.closeApp.onclick = window.close;
}

generateMenu({
	File: undefined,
	Edit: undefined,
	View: undefined,
	Tools: undefined,
	Help: undefined,
});

setTitle(`Welcome - ${application.name}`);

function setTitle(title) {
	document.title = title;
	components.title.innerText = title;
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
