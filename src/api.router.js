const { Router } = require("express");
const linksManager = require("./instances/links-manager.instance");
const appManager = require("./instances/app-manager.instance");

const apiRouter = Router();

apiRouter.get("/links", async (_req, res) => {
    const links = await linksManager.getData();
    const launched = Object.values(appManager.apps).map((item) => {
        return { pid: item.pid, alias: item.alias };
    });

    res.json({ links, launched });
});

apiRouter.get("/launch/:link", async (req, res) => {
    const links = await linksManager.getData();
    const { link } = req.params;
    const linkData = links[link];

    if (!linkData) {
        return res.status(400).json({ message: "Unknown link" });
    }

    await appManager.launch(linkData.Name, linkData.Target, linkData.Arguments);

    res.status(200).json({ message: "Launched" });
});

apiRouter.get("/close/:pid", async (req, res) => {
    const pid = Number(req.params.pid);
    if (!pid) {
        return res.status(400).json({ message: "PID is not a number" });
    }

    await appManager.close(pid, "SIGTERM");

    res.status(200).json({ message: "Closed" });
});

module.exports = apiRouter;
