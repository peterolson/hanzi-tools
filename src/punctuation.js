let englishReplacements = {
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

let chineseReplacements = {};
for (let k in englishReplacements) {
    chineseReplacements[englishReplacements[k]] = k;
}

function normalizeText(text, replacements) {
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

function normalizeEnglish(text) {
    return normalizeText(text, englishReplacements);
}

function normalizeChinese(text) {
    return normalizeText(text, chineseReplacements);
}

module.exports = {
    normalizeEnglish,
    normalizeChinese
};