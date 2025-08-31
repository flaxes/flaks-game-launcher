const { spawn, ChildProcess } = require("child_process");
const argvParse = require("./argv-parser");

/**
 * @typedef {{pid: number; alias: string; process: ChildProcess; }} ManagerProcess
 */

class AppManager {
    /** @readonly @type {Record<number, ManagerProcess>} */
    apps = {};
    constructor() {}

    /**
     *
     * @param {string} alias
     * @param {string} pathToExe
     * @param {string | string[]} [args]
     * @returns {Promise<ManagerProcess>}
     */
    async launch(alias, pathToExe, args) {
        if (!args) {
            args = [];
        } else if (typeof args === "string") {
            args = argvParse(args);
        }

        const error = new Error();

        return new Promise((resolve, reject) => {
            let isResolved = false;

            const process = spawn(pathToExe, args, { detached: true, stdio: "ignore" });
            process.unref();

            process.on("spawn", () => {
                const pid = process.pid;
                if (!pid) {
                    return reject(new Error("NO PID!"));
                }

                const data = {
                    pid,
                    alias,
                    process,
                };

                this.apps[pid] = data;

                isResolved = true;

                resolve(data);
            });

            process.on("error", (err) => {
                err.stack = error.stack;

                if (isResolved) return;
                isResolved = true;

                reject(err);
            });

            process.on("close", () => {
                if (process.pid) {
                    delete this.apps[process.pid];
                }

                // console.debug(process.pid, "closed");
            });
        });
    }

    /**
     *
     * @param {number} pid
     * @param {NodeJS.Signals} signal
     */
    close(pid, signal = "SIGTERM") {
        if (this.apps[pid]) {
            this.apps[pid].process.kill(signal);
        }
    }
}

module.exports = AppManager;
