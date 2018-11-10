let pinyin = require("pinyin"),
    nodejieba = require("nodejieba"),
    pinyinDict = require("./pinyinDict");

let punctuation = new Set("！？，。：；’”）%~@#^&*");

function pinyinify(text, isDetailed) {
    text = spacePunctuation(text);
    let cut = nodejieba.cut(text);
    let out = "", prevIsCharacter = false;
    let pinyinSegments = [];
    cut.forEach((text, i, cuts) => {
        let word = pinyinifyWord(text, cuts, i);
        pinyinSegments.push(word);
        if (prevIsCharacter && !punctuation.has(text)) {
            out += " " + word;
        } else {
            out += word;
        }
        prevIsCharacter = word !== text;
    });
    if (isDetailed) {
        pinyinSegments = pinyinSegments.filter(x => x.trim()).map(fixPunctuation);
        return {
            segments: cut.filter(x => x.trim()),
            pinyinSegments,
            pinyinSegmentsSyllables: pinyinSegments.map(segment => segment.split("\u200B")),
            pinyin: fixPunctuation(out)
        };
    }
    return fixPunctuation(out);
}

function pinyinifyWord(text, cuts, cutIndex) {
    if (!text.length) {
        return { word: "", segments: [] };
    }
    if (text.length === 1) {
        return pinyinifyChar(text, cuts, cutIndex);
    }
    let word;
    let i;
    for (i = text.length; i > 0; i--) {
        let chunk = text.slice(0, i);
        if (pinyinDict[chunk]) {
            word = pinyinDict[chunk];
            break;
        }
    }
    if (i === text.length) {
        return word;
    }
    if (i === 0) {
        word = pinyinifyChar(text[0], cuts, cutIndex);
        i++;
    }

    let remainderWord = pinyinifyWord(text.slice(i), cuts, cutIndex);
    return word + "\u200B" + remainderWord;
}

function pinyinifyChar(text, cuts, cutIndex) {
    let disambiguatedChar = decideAmbiguousChar(text, cuts, cutIndex);
    if (disambiguatedChar) {
        return disambiguatedChar;
    }
    let word = pinyinDict[text];
    if (word) {
        return word;
    }
    let arr = pinyin(text, {
        heteronym: true,
        segment: true
    });
    let syllables = arr.map((x) => x[0]);
    return syllables.join("\u200B");
}

function decideAmbiguousChar(char, cuts, cutIndex) {
    let previousText = cuts.slice(Math.max(0, cutIndex - 10), cutIndex);
    let afterText = cuts.slice(cutIndex + 1, cutIndex + 10);
    switch (char) {
        case "觉":
        case "覺":
            if (previousText.join("").includes("睡")) return "jiào";
            return "jué";
        case "长":
        case "長":
            // zhǎng has higher frequency due to compond words, 
            // but cháng is more common as an individual character.
            return "cháng";
        case "得":
        // leaving placeholder, will require further analysis
        case "还":
        case "還":
        // leaving placeholder, will require further analysis
    }
}

function spacePunctuation(text) {
    return text.replace(/([！？，。：；’”%）]+)([^ ！？，。：；’”%）])/g, (x, p, n) => p + " " + n)
        .replace(/([0-9]+)([^ 0-9\.\?\!\)\]\}！？，。：；’”）%~\@\#\^\&\*])/g, (x, p, n) => p + " " + n);
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
        "）": ")",
        "【": "[",
        "】": "]"
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