import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: "Szopiński CNC Diploma",
        width: 1024,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.on("ready", () => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length == 0)
            createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform != "darwin")
        app.quit();
});

ipcMain.on("set-port", (event, port) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (port)
        window.setTitle(`${port} - Szopiński CNC Diploma`);
    else
        window.setTitle("Szopiński CNC Diploma");
});
