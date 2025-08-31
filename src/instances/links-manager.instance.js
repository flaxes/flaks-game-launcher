const config = require("../../config");
const LinksManager = require("../lib/links-manager");

const linksManager = new LinksManager(config.linksDirectory, config.iconsDirectory, config.updateIntervalMs);

module.exports = linksManager;
