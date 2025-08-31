/**
 *
 * @param {string} value
 * @param {*} [env]
 * @param {*} [file]
 * @returns
 */
function argvParse(value, env, file) {
    const myRegexp = /([^\s'"]([^\s'"]*(['"])([^\x03]*?)\3)+[^\s'"]*)|[^\s'"]+|(['"])([^\x05]*?)\5/gi;
    let myString = value;

    const myArray = [];
    if (env) {
        myArray.push(env);
    }
    if (file) {
        myArray.push(file);
    }

    let match;
    do {
        match = myRegexp.exec(myString);
        if (match !== null) {
            myArray.push(firstString(match[1], match[6], match[0]));
        }
    } while (match !== null);

    return myArray;
}

function firstString() {
    const args = [];
    for (let _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg === "string") {
            return arg;
        }
    }
}

module.exports = argvParse;
