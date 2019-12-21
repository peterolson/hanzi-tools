var pinyinify = require("./src/pinyinify"),
    segment = require("./src/segment"),
    tag = require('./src/tag'),
    { simplify, traditionalize } = require("./src/simplify"),
    { isCharacterText } = require("./src/util");


module.exports = {
    pinyinify,
    segment,
    simplify,
    traditionalize,
    tag,
    isCharacterText
};