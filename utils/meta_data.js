var path = require('path');
var strings = require('./primatives/strings');

var DEFAULT_DELIMITER = '-';

module.exports = {
    DEFAULT_DELIMITER   : DEFAULT_DELIMITER,

    cleanName       : clean,
    isValidName     : isValidName,

    fromDelimited   : fromDelimited,
    fromFileName    : fromFileName
};

function isValidName(value){
    return strings.isValid(clean(value));
}

function fromDelimited(value, delimiter){
    delimiter = delimiter || DEFAULT_DELIMITER;
    var parts = value.split(delimiter);
    if (parts.length < 1) { return ''; }
    for (var i = 0; i < parts.length; i += 1) {
        parts[i] = clean(parts[i]);
    }

    var results = {
        title   : parts[0],
        edition : ((parts.length > 2) ? parts[1] : ''),
        artist  : ((parts.length > 2) ? parts[2] : parts[1])
    }

    if (!results.title) { return null; }

    if (results.title && results.edition) {
        if (hasParens(results.edition)) {
            results.fullTitle = results.title + ' ' + results.edition;
        } else {
            results.fullTitle = results.title + ' (' + results.edition + ')';
        }
    }

    return results;
}
function fromFileName(value, delimiter) {
    delimiter = delimiter || DEFAULT_DELIMITER;
    var ext = path.extname(value);
    var name = value.substr(0, (value.length - ext.length));
    return fromDelimited(name, delimiter);
}

// -----

function hasParens(value){
    value = value || '';
    return (value.indexOf('(') >= 0 || value.indexOf('(') >= 0);
}
function clean(value) {
    return (value || '')
        .split('.').join('')
        .split('  ').join(' ')
        .split('  ').join(' ')
        .trim();
}
