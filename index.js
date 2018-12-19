var pinyinify = require("./src/pinyinify"),
    segment = require("./src/segment"),
    { simplify, traditionalize } = require("./src/simplify");

module.exports = {
    pinyinify,
    segment,
    simplify,
    traditionalize
};