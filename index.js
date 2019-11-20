var pinyinify = require("./src/pinyinify"),
    segment = require("./src/segment"),
    tag = require('./src/tag'),
    { simplify, traditionalize } = require("./src/simplify");


module.exports = {
    pinyinify,
    segment,
    simplify,
    traditionalize,
    tag
};