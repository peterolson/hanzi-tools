let segment = require("./segment"),
    pinyin = require("pinyin"),
    { pinyinDict } = require("./pinyinDict"),
    { normalizeEnglish } = require("./punctuation"),
    tag = require("./tag"),
    { isCharacterText } = require("./util");

const tones = [
    ['ā','ē','ī','ō','ū','ǖ','Ā','Ē','Ī','Ō','Ū','Ǖ'],
    ['á','é','í','ó','ú','ǘ','Á','É','Í','Ó','Ú','Ǘ'],
    ['ǎ','ě','ǐ','ǒ','ǔ','ǚ','Ǎ','Ě','Ǐ','Ǒ','Ǔ','Ǚ'],
    ['à','è','ì','ò','ù','ǜ','À','È','Ì','Ò','Ù','Ǜ'],
    ['a','e','i','o','u','ü','A','E','I','O','U','Ü']
]; //Use tones[tone - 1] to get all possible characters with that tone

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
            let nextTag = nextTags && nextTags.length && nextTags[0].tag;
            if (nextTag === "uz")
                return "zhǎng";
            let prevTag = prevTags && prevTags.length && prevTags[prevTags.length - 1].tag;
            if (prevTag === "n") return "zhǎng";
            if (prevTag !== "d" && nextTag === "ul") {
                return "zhǎng";
            }
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
                if (afterTag === "ul") {
                    return "dé";
                }
                if (prevTag === "d" || prevTag === "r") {
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
            if (previousText.join("").includes("把")) return "huán";
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
        case "不":
            if (afterText.length > 0) {
                const nextTone = getTone(afterText[0].charAt(0));
                if (nextTone === 4) return "bú";
            }
            break;
        case "一":
            if (afterText.length > 0) {
                const nextTone = getTone(afterText[0].charAt(0));
                if (nextTone === 1 || nextTone == 2 || nextTone == 3) return "yì";
                else if (nextTone == 4) return "yí";
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

function getTone(char) {
    if(typeof pinyinDict[char] === 'undefined') return 0;

    const pinyinChars = [...pinyinDict[char]]; //Getting and destructuring the pinyin string
    for (i = 0; i < 4; i++) { //Going through the four tones and checking if there is a match
        if (tones[i].some(c => pinyinChars.includes(c))) return i + 1;
    }
    return 5;
}

module.exports = pinyinify;
