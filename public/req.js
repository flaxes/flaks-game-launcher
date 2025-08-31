/**
 *
 * @param {string | { url: string; body?: object; method?: 'GET' | 'POST'; timeoutMs?: number; headers?: object; skipAuth?: boolean;}} url
 * @param {Record<string, any>} [body]
 * @param {'GET' | 'POST'} [method]
 * @param {number} [timeoutMs]
 * @returns
 */
function request(url, body, method = "POST", timeoutMs = 60000) {
    const timeoutControl = new AbortController();
    /** @type {RequestInit & { headers: Record<string, string> }} */
    const options = { signal: timeoutControl.signal, headers: {} };

    if (typeof url === "object") {
        if (url.method) {
            method = url.method;
        }

        if (url.body) {
            body = url.body;
        }

        if (url.headers) {
            options.headers = url.headers;
        }

        if (url.timeoutMs) {
            timeoutMs = timeoutMs;
        }

        url = url.url;
    }

    options.method = method;

    if (body) {
        if (method === "POST") {
            options.body = JSON.stringify(body, (_key, val) => {
                if (val && typeof val.toStringJson === "function") return val.toStringJson();

                return val;
            });

            options.headers["Content-Type"] = "application/json";
        } else {
            url += `?${new URLSearchParams(body)}`;
            options.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
    }

    // Make sure url will not be changed due race conditions
    const strUrl = url;

    const createRequest = async () => {
        const req = fetch(strUrl, options).catch((err) => err);
        const timeout = setTimeout(() => timeoutControl.abort(), timeoutMs);

        const response = await req;
        clearTimeout(timeout);

        if (response instanceof DOMException) {
            throw new Error("req_timeout");
        }

        if (response instanceof Error) {
            throw response;
        }

        const json = await response.json();

        if (response.status > 399) {
            const err = new Error(json.message || json, { cause: json });

            /** @ts-ignore */
            err.code = response.status;

            throw err;
        }

        return json;
    };

    return createRequest();
}

function getLinksReq() {
    return request("/api/links", void 0, "GET", 20e3);
}

let launchInProgress = false;
async function launchLinkReq(link) {
    if (launchInProgress) return;
    launchInProgress = true;

    await request(`/api/launch/${link}`, void 0, "GET", 20e3).catch((err) => {
        alert(err.message);
    });

    launchInProgress = false;
}

let closeInProgress = false;
async function closeLinkReq(link) {
    if (closeInProgress) return;
    closeInProgress = true;

    await request(`/api/close/${link}`, void 0, "GET", 20e3).catch((err) => {
        alert(err.message);
    });

    closeInProgress = false;
}
