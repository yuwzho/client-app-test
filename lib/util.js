const fs = require('fs');

module.exports.readFileSync = function read(filename) {
    var content = fs.readFileSync(filename);
    return JSON.parse(content);
}