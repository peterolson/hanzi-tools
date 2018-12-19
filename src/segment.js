let nodejieba = require("nodejieba");
let { pinyinDict } = require("./pinyinDict");

function segment(text) {
    let cut = nodejieba.cut(text);
    let segments = [];
    cut.forEach((text) => {
        segments = segments.concat(segmentPart(text));
    });
    return segments;
}

function segmentPart(text) {
    if (!text.length) return [];
    if (text in pinyinDict || text.length === 1) {
        return [text];
    }
    for (let i = text.length - 1; i > 0; i--) {
        let part = text.slice(0, i);
        if (part in pinyinDict) {
            return [part].concat(segmentPart(text.slice(i)));
        }
    }
    return [text[0]].concat(segmentPart(text.slice(1)))
}

module.exports = segment;