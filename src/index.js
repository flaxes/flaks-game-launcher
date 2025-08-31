const fs = require("fs");

if (!fs.existsSync("./config.js")) {
    fs.copyFileSync("./config_example.js", "./config.js");
}

require("./bootstrap");
