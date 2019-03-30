let segment = require("./segment"),
    pinyin = require("pinyin"),
    { pinyinDict } = require("./pinyinDict"),
    { normalizeEnglish } = require("./punctuation");

function pinyinify(text, isDetailed) {
    let segments = segment(text);
    let pinyinSegments = [];
    segments.forEach((text, i, segments) => {
        if (text.length === 1) pinyinSegments.push(pinyinifyChar(text, segments, i));
        else pinyinSegments.push(pinyinDict[text]);
    });

    let out = [];
    pinyinSegments.forEach((text, i) => {
        if (shouldPutSpaceBetween(segments[i], segments[i + 1])) {
            out.push(text + " ");
        } else {
            out.push(text);
        }
    });
    out = out.join("").trim();
    if (isDetailed) {
        segments = segments;
        pinyinSegments = pinyinSegments.map(normalizeEnglish);
        return {
            segments,
            pinyinSegments,
            pinyinSegmentsSyllables: pinyinSegments.map(segment => segment.split("\u200B")),
            pinyin: normalizeEnglish(out)
        };
    }
    return normalizeEnglish(out);
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

function isCharacterText(text) {
    // https://stackoverflow.com/questions/21109011/javascript-unicode-string-chinese-character-but-no-punctuation
    return /^([\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])+$/.test(String(text));
}

function shouldPutSpaceBetween(word1, word2) {
    if (!word2) return false;
    if (isCharacterText(word1) && isCharacterText(word2)) return true;
    if (isCharacterText(word1) && /[ `"'“‘\(\[（【0-9]/.test(word2)) return true;
    let punctuationPattern = /[0-9\.\?\!\)\]\}！？，。：；’”）%~\@\#\^\&\*]/;
    let numberPattern = /[0-9]/;
    if (numberPattern.test(word1) && numberPattern.test(word2)) return false;
    if (punctuationPattern.test(word1) && !punctuationPattern.test(word2)) return true;
    if (punctuationPattern.test(word1) && numberPattern.test(word2)) return true;
    return false;

}

module.exports = pinyinify;