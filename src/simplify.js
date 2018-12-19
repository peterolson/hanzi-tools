let segment = require("./segment"),
    { s2tDict, t2sDict } = require("./pinyinDict");

function simplify(text) {
    return segment(text).map(x => {
        if (x in t2sDict) return t2sDict[x];
        return x;
    }).join("");
}

function traditionalize(text) {
    return segment(text).map(x => {
        if (x in s2tDict) return s2tDict[x];
        return x;
    }).join("");
}

module.exports = {
    simplify,
    traditionalize
};