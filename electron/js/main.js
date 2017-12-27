const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 900
	});
	
	mainWindow.loadURL('file://' + __dirname + '/../html/index.html');
	mainWindow.on('closed', function(){
		mainWindow = null;
	});
});
app.on('window-all-closed', function(){
	app.quit();
});