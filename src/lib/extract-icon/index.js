const { execFile } = require("child_process");
const nodePath = require("path");
const fs = require("fs");
const pc = process.cwd();

function extractIcon(exePath, resultPath) {
    const exeAbsolutePath = nodePath.resolve(pc, exePath);
    const resultAbsolutePath = nodePath.resolve(pc, resultPath);

    return new Promise((resolve, reject) => {
        execFile("extract-icon.exe", [exeAbsolutePath, resultAbsolutePath], (err, stdout) => {
            if (err) return reject(err);

            resolve(stdout);
        });
    });
}

function extractIconToBase64(exePath) {
    const exeAbsolutePath = nodePath.resolve(pc, exePath);
    const resultAbsolutePath = nodePath.resolve(pc, `./temp_${Date.now()}.png`);

    return new Promise((resolve, reject) => {
        execFile("extract-icon.exe", [exeAbsolutePath, resultAbsolutePath], (err) => {
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
    });
}

module.exports = { extractIcon, extractIconToBase64 };
