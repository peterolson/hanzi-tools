let pinyin = require("pinyin"),
    nodejieba = require("nodejieba"),
    pinyinDict = require("./pinyinDict");

let punctuation = new Set("！？，。：；’”）%~@#^&*");

function pinyinify(text, isDetailed) {
    text = spacePunctuation(text);
    let cut = nodejieba.cut(text);
    let out = "", prevIsCharacter = false;
    let pinyinSegments = [];
    let pinyinSegmentsSyllables = [];
    cut.forEach((text) => {
        let { word, segments } = pinyinifyWord(text);
        pinyinSegmentsSyllables.push(segments);

        pinyinSegments.push(word);
        if (prevIsCharacter && !punctuation.has(text)) {
            out += " " + word;
        } else {
            out += word;
        }
        prevIsCharacter = word !== text;
    });
    if (isDetailed) {
        return {
            segments: cut.filter(x => x.trim()),
            pinyinSegments: pinyinSegments.filter(x => x.trim()).map(fixPunctuation),
            pinyinSegmentsSyllables: pinyinSegmentsSyllables.map(x => x.filter(x => x.trim()).map(fixPunctuation)).filter(x => x.length),
            pinyin: fixPunctuation(out)
        };
    }
    return fixPunctuation(out);
}

function pinyinifyWord(text) {
    if (!text.length) {
        return { word: "", segments: [] };
    }
    if (text.length === 1) {
        return pinyinifyChar(text);
    }
    let segments = [];
    let word;
    let i;
    for (i = text.length; i > 0; i--) {
        let chunk = text.slice(0, i);
        if (pinyinDict[chunk]) {
            word = pinyinDict[chunk];
            segments = segmentSyllables(chunk, word);
            break;
        }
    }
    if (i === text.length) {
        return { word, segments };
    }
    if (i === 0) {
        ({ word, segments } = pinyinifyChar(text[0]));
        i++;
    }

    let { word: remainderWord, segments: remainderSegments } = pinyinifyWord(text.slice(i));
    return { word: word + remainderWord, segments: segments.concat(remainderSegments) };
}

function pinyinifyChar(text) {
    let word = pinyinDict[text];
    if (word) {
        return { word, segments: [word] }
    }
    let arr = pinyin(text, {
        heteronym: true,
        segment: true
    });
    let syllables = arr.map((x) => x[0]);
    word = syllables.join("");
    return { word, segments: syllables };
}

function segmentSyllables(text, word) {
    let textReadings = pinyin(text, { heteronym: true });
    let segments = [];
    for (let syllableReadings of textReadings) {
        let bestReading = syllableReadings[0];
        for (let reading of syllableReadings) {
            if (!word) console.log("HEY!", text, word, reading);
            if (word.startsWith(reading)) {
                bestReading = reading;
                break;
            }
        }
        segments.push(word.slice(0, bestReading.length));
        word = word.slice(bestReading.length);
    }
    return segments;
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