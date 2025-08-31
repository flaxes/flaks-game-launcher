const express = require("express");
const { ipWhitelist } = require("../config");
const apiRouter = require("./api.router");

const app = express();

app.use((req, res, next) => {
    if (typeof req.ip === "string") {
        for (const ip of ipWhitelist) {
            if (req.ip.startsWith(ip)) {
                return next();
            }
        }
    }

    console.warn(`Unknown IP tried to access! ${req.ip}`);

    req.destroy();
});

app.use(express.static("public"));
app.use("/icons", express.static("ICONS"));

app.use("/api", apiRouter);

module.exports = { app };
