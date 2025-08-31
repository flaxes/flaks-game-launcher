const { port } = require("../config");
const linksManager = require("./instances/links-manager.instance");
const { app } = require("./server");

async function main() {
    await linksManager.init();

    app.listen(port, "0.0.0.0", () => {
        console.info(`Flaks Game-Launcher started on http://localhost:${port}`);
    });
}

main().catch((err) => console.error("FATAL", err));
