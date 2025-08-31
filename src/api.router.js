const { Router } = require("express");
const linksManager = require("./instances/links-manager.instance");

const apiRouter = Router();

apiRouter.get("/links", async (req, res) => {
    const links = await linksManager.getData();

    res.json(links);
});

module.exports = apiRouter;
