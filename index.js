var pinyinify = require("./src/pinyinify"),
    segment = require("./src/segment"),
    { simplify, traditionalize } = require("./src/simplify");
let nodejieba = require("nodejieba");

module.exports = {
    pinyinify,
    segment,
    simplify,
    traditionalize,
    tag: nodejieba.tag
};