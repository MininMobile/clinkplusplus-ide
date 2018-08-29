const remote = require("electron").remote;
const application = { name: "CIDE" }; // replace with require("./lib/application") soon pls
const components = {
	title: document.getElementById("title"),
	minimizeApp: document.getElementById("action-minimize"),
	maximizeApp: document.getElementById("action-maximize"),
	closeApp: document.getElementById("action-close")
};

{
	components.maximizeApp.onclick = () => {
		let w = remote.getCurrentWindow();

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

setTitle(`Welcome - ${application.name}`);

function setTitle(title) {
	document.title = title;
	components.title.innerText = title;
}
