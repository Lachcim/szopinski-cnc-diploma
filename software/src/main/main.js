import { app, BrowserWindow } from "electron";
import path from "path";

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: "Szopiński CNC Diploma",
        width: 800,
        height: 600
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.on("ready", createWindow);
