const linksManager = require("./instances/links-manager.instance");

async function main() {
    const data = await linksManager.init();

    console.log(data);
}

main().catch((err) => console.error("FATAL", err));
