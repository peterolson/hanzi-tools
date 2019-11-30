let nodejieba = require("nodejieba"),
    { isCharacterText } = require("./util");

function tag(text) {
    let tokens = nodejieba.tag(text);
    let outTokens = [];
    for (let { word, tag } of tokens) {
        if (word.length > 1 && (tag === "x" || (tag === "n" && word.includes("吗")))) {
            for (let char of word) {
                outTokens.push(nodejieba.tag(char)[0]);
            }
        }
        else outTokens.push({ word, tag });
    }
    return outTokens;
}

module.exports = tag;