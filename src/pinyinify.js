let segment = require("./segment"),
    pinyin = require("pinyin"),
    { pinyinDict } = require("./pinyinDict"),
    { normalizeEnglish } = require("./punctuation"),
    tag = require("./tag"),
    { isCharacterText } = require("./util");

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
    let nextTags, prevTags;
    switch (char) {
        case "觉":
        case "覺":
            if (previousText.join("").includes("睡")) return "jiào";
            return "jué";
        case "长":
        case "長":
            prevTags = tag(previousText.join(""));
            nextTags = tag(afterText.join(""));
            if (nextTags && nextTags.length && nextTags[0].tag === "uz")
                return "zhǎng";
            let prevTag = prevTags && prevTags.length && prevTags[prevTags.length - 1].tag;
            if (prevTag === "n") return "zhǎng";
            // zhǎng has higher frequency due to compond words, 
            // but cháng is more common as an individual character.
            return "cháng";
        case "得":
            nextTags = tag(afterText.join(""));
            prevTags = tag(previousText.join(""));
            if (nextTags && nextTags.length) {
                let afterTag = nextTags[0].tag;
                let prevTag = prevTags.length && prevTags[prevTags.length - 1].tag
                if (prevTag === "v") {
                    break;
                }
                if (prevTag === "a" || prevTag === "b" || prevTag === "nr") {
                    break;
                }
                if (prevTag === "d") {
                    return "děi";
                }

                if (nextTags[0].word === "还" || nextTags[0].word === "還") {
                    if (nextTags[1] && nextTags[1].tag[0] === "r" || nextTags[1].tag[0] === "n") {
                        return "děi";
                    }
                }
                if (afterTag[0] === "t" || afterTag[0] === "v" || afterTag[0] === "p" || afterTag[0] === "l" || afterTag[0] === "n") {
                    return "děi";
                }
            }
            break;
        case "还":
        case "還":
            nextTags = tag(afterText.join(""));
            if (nextTags && nextTags.length) {
                let afterTag = nextTags[0].tag;
                if (afterText[0][0] === "有") break;
                if (afterTag[0] === "r" || afterTag[0] === "n") {
                    return "huán";
                }
            }
            break;
        case "行":
            prevTags = tag(previousText.join(""));
            nextTags = tag(afterText.join(""));
            if (prevTags.length && prevTags[prevTags.length - 1].tag === "m") {
                return "háng";
            }
            break;
        case "只":
            let prev = tag(previousText.join("")).slice(-1)[0];
            let after = tag(afterText.join(""))[0];
            if (prev && prev.tag === "m") return "zhī";
            if (after && after.tag === "n") return "zhī";
            return "zhǐ";
        case "系":
            nextTags = tag(afterText.join(""));
            if (nextTags && nextTags.length) {
                let afterTag = nextTags[0].tag;
                if (afterTag === "f" || afterTag[0] === "u") return "jì";
            }
            return "xì";
        case "地":
            prevTags = tag(previousText.join(""));
            nextTags = tag(afterText.join(""));
            if (prevTags.length && prevTags[prevTags.length - 1].tag === "r") {
                return "dì";
            }
            break;
        case "弹":
            nextTags = tag(afterText.join(""));
            if (afterText.includes("吉他")) return "tán";
            if (nextTags && nextTags.length) {
                let afterTag = nextTags[0].tag;
                if (afterTag[0] === "n") return "tán";
            }
            break;
        case "重":
            nextTags = tag(afterText.join(""));
            if (nextTags && nextTags.length) {
                let afterTag = nextTags[0].tag;
                if (afterTag[0] === "v") return "chóng";
            }
            break;
    }
}

function shouldPutSpaceBetween(word1, word2) {
    if (!word2) return false;
    if (word2 === " ") return false;
    if (isCharacterText(word1) && isCharacterText(word2)) return true;
    if (isCharacterText(word1) && /[ `"'“‘\(\[（【0-9]/.test(word2)) return true;
    if (/[`"'“‘\(\[（【]/.test(word1)) return false;
    let punctuationPattern = /[0-9\.\?\!\)\]\}！？，。：；’”）%~\@\#\^\&\*]/;
    let numberPattern = /[0-9]/;
    if (numberPattern.test(word1) && numberPattern.test(word2)) return false;
    if (punctuationPattern.test(word1) && !punctuationPattern.test(word2)) return true;
    if (punctuationPattern.test(word1) && numberPattern.test(word2)) return true;
    if (isCharacterText(word1) && punctuationPattern.test(word2)) return false;
    if (isCharacterText(word1) !== isCharacterText(word2)) return true;
    return false;

}

module.exports = pinyinify;