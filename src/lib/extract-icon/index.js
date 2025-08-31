const { execFile } = require("child_process");
const nodePath = require("path");
const fs = require("fs");
const pc = process.cwd();
const pathToUtility = nodePath.resolve(__dirname, "./extract-icon.exe");

function extractIcon(exePath, resultPath) {
    const exeAbsolutePath = nodePath.resolve(pc, exePath);
    const resultAbsolutePath = nodePath.resolve(pc, resultPath);
    const stack = new Error().stack;

    return new Promise((resolve, reject) => {
        execFile(pathToUtility, [exeAbsolutePath, resultAbsolutePath], (err, stdout) => {
            if (err) {
                err.stack = stack;

                return reject(err);
            }

            resolve(stdout);
        });
    });
}

function extractIconToBase64(exePath) {
    const q = (item) => `"${item}"`;

    const exeAbsolutePath = q(nodePath.resolve(pc, exePath));
    const resultAbsolutePath = q(nodePath.resolve(pc, `./temp_${Date.now()}.png`));

    return new Promise((resolve, reject) => {
        const pc = execFile(pathToUtility, [exeAbsolutePath, resultAbsolutePath], (err) => {
            if (err) return reject(err);

            const finish = () => fs.rmSync(resultAbsolutePath);

            fs.readFile(resultAbsolutePath, { encoding: "base64" }, (err, data) => {
                finish();

                if (err) {
                    return reject(err);
                }

                resolve(data);
            });
        });

        pc.on("error", (err) => reject(err));
    });
}

module.exports = { extractIcon, extractIconToBase64 };
