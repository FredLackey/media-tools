var readdirp = require('readdirp');
var strings  = require('./strings');

var DEFAULT_DELIMITER = '|';

module.exports = {
    DEFAULT_DELIMITER : DEFAULT_DELIMITER,

    find : find,
    toExtensionArray : toExtensionArray,
    cleanExtension   : cleanExtension
};

function find(folderPath, extensions, cb) {

    var settings = {
        root: folderPath,
        fileFilter: [].concat(extensions)
    };

    readdirp(settings, 
        function(fileInfo){

        },
        function(err, results){
            if (err) { return cb(err); }
            if (!results) { return cb('Invalid path: ' + settings.root); }
            cb(err, [].concat(results.files));
        });
}

function toExtensionArray(value, delimeter) {
    delimeter = delimeter || DEFAULT_DELIMITER;
    var result = [];
    (value || '').split(delimeter).forEach(element => {
        var item = cleanExtension(element);
        if (item.length > 0) { result.push(item); }
    });
    return result;
}

function cleanExtension(value){
    var result  = '';
    var special = '_.';
    var valid   = strings.ALPHANUMERIC + special; 
    var chars   = (value || '').split('');
    for (var i = 0; i < chars.length; i += 1) {
        var ch = chars[i];
        if (valid.indexOf(ch) < 0) { continue; }
        if (special.indexOf(ch) >= 0 && result.length === 0) { continue; }
        result += ch;
    }
    if (result.length < 1) { return result; }
    while (result.length > 1 && special.indexOf(result.substr(result.length - 1)) >= 0) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}