const { port } = require("../config");
const linksManager = require("./instances/links-manager.instance");
const { app } = require("./server");

async function main() {
    const data = await linksManager.init();

    app.listen(port, "0.0.0.0", () => {
        console.info(`Flaks Game-Launcher started on http://localhost:${port}`);
    });

    console.log(data);
}

main().catch((err) => console.error("FATAL", err));
