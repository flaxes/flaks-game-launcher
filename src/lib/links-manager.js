const fs = require("fs");
const nodePath = require("path");
const { execFile } = require("child_process");
const { extractIcon } = require("./extract-icon");

const checkAndCreateDir = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

class LinksManager {
    /**
     *
     * @param {string} linksDirectory
     * @param {string} iconsDirectory
     * @param {number} updateIntervalMs
     */
    constructor(linksDirectory, iconsDirectory, updateIntervalMs = 60e3) {
        const processStart = process.cwd();

        /** @readonly */
        this.linksDirectory = nodePath.resolve(processStart, linksDirectory);
        checkAndCreateDir(this.linksDirectory);

        /** @readonly */
        this.iconsDirectory = nodePath.resolve(processStart, iconsDirectory);
        checkAndCreateDir(this.iconsDirectory);

        /** @readonly */
        this.updateIntervalMs = updateIntervalMs;

        /** @private */
        this.data = null;
        /** @type {NodeJS.Timeout | null} */
        this.timeout = null;
    }

    async init() {
        await this.update();
    }

    getData() {
        return this.data;
    }

    /** @private */
    async update() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        try {
            const links = await this.getLinks();
            const linkNames = links.map((item) => item.Name);

            await this.checkIcons(linkNames);

            this.data = links;
        } catch (err) {
            console.error("OnUpdate", err);
        } finally {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => this.update(), this.updateIntervalMs);
            this.timeout.unref();
        }
    }

    /** @private */
    async getLinks() {
        const linksInfoPromises = this.getLinkTargets(this.linksDirectory);
        const linksInfo = await linksInfoPromises;

        return linksInfo;
    }

    /**
     * @private
     * @param {string} linkPath
     * @param {string} lnk
     */
    async createIcon(linkPath, lnk) {
        const result = await extractIcon(linkPath, `${this.iconsDirectory}/${lnk}.png`);

        return result;
    }

    /** @private */
    getIcons() {
        return fs.readdirSync(this.iconsDirectory);
    }

    /**
     * @private
     * @param {string[]} existingLinks
     */
    async checkIcons(existingLinks) {
        const currentIcons = this.getIcons();
        const iconsToCreate = new Set(existingLinks);

        // Purge icons of deleted links
        for (const icon of currentIcons) {
            const lnk = icon.slice(0, -4);

            if (existingLinks.includes(lnk)) {
                iconsToCreate.delete(lnk);
                continue;
            }

            fs.rmSync(`${this.iconsDirectory}/${icon}`);
        }

        for (const lnk of iconsToCreate) {
            const lnkPath = `${this.linksDirectory}/${lnk}`;

            await this.createIcon(lnkPath, lnk);
        }
    }

    /**
     * @private
     * @param {string} dirPath
     * @returns {Promise<LinkTargetInfo[]>}
     */
    getLinkTargets(dirPath) {
        const psCommand = `
Add-Type -AssemblyName System.Drawing
Get-ChildItem '${dirPath}' -Filter *.lnk | ForEach-Object {
    $s  = New-Object -ComObject WScript.Shell
    $sc = $s.CreateShortcut($_.FullName)

    [PSCustomObject]@{
        Name         = $_.Name
        FullName     = $_.FullName
        Target       = $sc.TargetPath
        Arguments    = $sc.Arguments
        WorkingDir   = $sc.WorkingDirectory
    }
} | ConvertTo-Json -Compress
`;

        return new Promise((resolve, reject) => {
            execFile("powershell.exe", ["-NoProfile", "-Command", psCommand], (err, stdout) => {
                if (err) return reject(err);

                try {
                    const results = JSON.parse(stdout || "[]");
                    resolve(Array.isArray(results) ? results : [results]);
                } catch (parseErr) {
                    reject(parseErr);
                }
            });
        });
    }
}

module.exports = LinksManager;
