const Tray = require("trayicon");
const fs = require("fs");
const iconPath = "./public/favicon.ico";

const icon = fs.readFileSync(iconPath, { encoding: "base64" });
require(".");

Tray.create(function (tray) {
    tray.setTitle("Flaks Launcher");
    tray.setIcon(icon);

    const quit = tray.item("Quit", () => {
        tray.kill();

        process.exit();
    });

    tray.setMenu(quit);
});
