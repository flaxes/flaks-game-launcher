const config = {
    port: 5000,

    linksDirectory: "./LINKS",
    iconsDirectory: "./ICONS",

    // 60 seconds
    updateIntervalMs: 60e3,

    // Allows localhost and any request from 88.x/1.x networks
    ipWhitelist: ["127.0.0.1", "192.168.88.", "192.168.1."],
};

module.exports = config;
