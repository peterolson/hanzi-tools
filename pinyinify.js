let pinyin = require("pinyin"),
    nodejieba = require("nodejieba"),
    pinyinDict = require("./pinyinDict");

let punctuation = new Set("！？，。：；’”）%");

function pinyinify(text) {
    text = spacePunctuation(text);
    let cut = nodejieba.cut(text);
    let out = "", prevIsCharacter = false;
    cut.forEach((text) => {
        let word;
        if (pinyinDict[text]) {
            word = pinyinDict[text];
        } else {
            let arr = pinyin(text, {
                heteronym: true,
                segment: true
            });
            word = arr.map((x) => x[0]).join("");
        }
        if (prevIsCharacter && ! punctuation.has(text)) {
            out += " " + word;
        } else {
            out += word;
        }
        prevIsCharacter = word !== text;
    });
    return fixPunctuation(out);
}

function spacePunctuation(text) {
    return text.replace(/([！？，。：；’”%）])([^ ])/g, (x,p,n) => p + " " + n)
        .replace(/([0-9]+)([^ 0-9\.\?\!\)\]\}%])/g, (x,p,n) => p + " " + n);
}

function fixPunctuation(text) {
    let replacements = {
        "！": "!",
        "？": "?",
        "。": ".",
        "，": ",",
        "：": ":",
        "；": ";",
        "‘": "`",
        "’": "'",
        "“": "``",
        "”": "\"",
        "（": "(",
        "）": ")"
    };
    let newString = "";
    for (let char of text) {
        if (char in replacements) {
            newString += replacements[char];
        } else {
            newString += char;
        }
    }
    return newString;
}

module.exports = pinyinify;