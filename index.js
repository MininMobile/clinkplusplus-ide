const { app, BrowserWindow } = require('electron');
const path = require("path");
const url = require("url");

let win;

function createWindow() {
	win = new BrowserWindow();

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'src/index.html'),
		protocol: "file:",
		slashes: true
	}));

	win.setBackgroundColor("#161616");
	win.setTitle("CIDE");

	win.setMinimumSize(800, 600);
	win.setResizable(true);
	win.maximize();

	win.focus();

	win.on("closed", app.quit);
}

app.on("window-all-closed", app.quit);
app.on("ready", createWindow);
