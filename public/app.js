function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
/**
 *
 * @param {Record<string, LinkTargetInfo>} links
 */
function renderLinks(links) {
    const sel = "#links-available .links";
    const dom = document.querySelector(sel);
    if (!dom) {
        throw new TypeError(`"${sel}" element isn't exists!`);
    }

    dom.innerHTML = "";

    for (const link of Object.values(links)) {
        const text = `<div class="link-text">${link.Name.slice(0, -4)}</div>`;
        const img = `<img class="link-image" src="icons/${link.Name}.png">`;

        const container = `<div class="link-container" data-link="${link.Name}">\n${img}\n${text}\n</div>\n`;

        dom.innerHTML += container;
    }

    const launch = (link) => {
        launchLinkReq(link).then(() => wait(100).then(updateLinks));
    };

    dom.querySelectorAll(".link-container").forEach((el) => {
        // @ts-ignore
        el.onclick = () => launch(el.dataset.link);
    });
}

/**
 *
 * @param {LinkLaunched[]} links
 */
function renderLaunchedLinks(links) {
    const sel = "#links-launched .links";
    const dom = document.querySelector(sel);
    if (!dom) {
        throw new TypeError(`"${sel}" element isn't exists!`);
    }
    dom.innerHTML = "";

    if (!links.length) {
        // @ts-ignore
        dom.parentElement.setAttribute("hidden", "");
        return;
    }

    // @ts-ignore
    dom.parentElement.removeAttribute("hidden");

    const closeLink = (pid) => {
        closeLinkReq(pid).then(() => wait(100).then(updateLinks));
    };

    for (const link of links) {
        const text = `<div class="link-text">${link.alias.slice(0, -4)}</div>`;
        const img = `<img class="link-image" src="icons/${link.alias}.png">`;
        const button = `<button class="close-link" data-alias="${link.alias}" data-pid="${link.pid}">Close</button>`;

        const container = `<div class="link-container">\n${img}\n${text}\n${button}\n</div>\n`;

        dom.innerHTML += container;
    }

    // @ts-ignore
    dom.querySelectorAll(".close-link").forEach((el) => (el.onclick = () => closeLink(el.dataset.pid)));
}

let lastData = "";
async function updateLinks() {
    const data = await getLinksReq();

    const dataStr = JSON.stringify(data);
    if (lastData === dataStr) {
        return;
    }

    lastData = dataStr;
    const { links, launched } = data;

    await renderLinks(links);
    await renderLaunchedLinks(launched);
}

async function main() {
    await updateLinks();
    setInterval(() => updateLinks(), 5e3);
}

main().catch((err) => alert(err));
