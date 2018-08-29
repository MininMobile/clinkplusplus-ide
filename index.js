const { app, BrowserWindow } = require('electron');
const path = require("path");
const url = require("url");

let win;

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(__dirname, 'src/img/icon-128.png'),
		minWidth: 800,
		minHeight: 600,
		resizable: true,
		title: "CIDE",
		backgroundColor: "#161616",
		frame: false
	});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'src/index.html'),
		protocol: "file:",
		slashes: true
	}));

	// win.setMenu(null);

	win.maximize();
	win.focus();

	win.on("closed", app.quit);
}

app.on("window-all-closed", app.quit);
app.on("ready", createWindow);
