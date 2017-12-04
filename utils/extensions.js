'use strict';

var arrays  = require('./primatives/arrays');
var files   = require('./primatives/files');

module.exports = {
    getCanceled : getCanceled,
    isEmpty     : isEmpty,
    isValid     : isValid,
    normalize   : normalize
};

function getCanceled(options, validExtensions) {
    var result = [];
    validExtensions.forEach(e => {
        if (options[e] === false) {
            result.push(e);
        }
    });
    return result;
}
function isEmpty(values) {
    if (typeof values === 'string') {
        values = values.split(files.DEFAULT_DELIMITER);
    }
    if (typeof values !== 'object' || !(values instanceof Array)) {
        return false;
    }
    return (arrays.removeEmpty(values).length < 1);
}
function isValid(values, validExtensions) {
    
    if (isEmpty(values)) { return true; }
    if (typeof values === 'string') {
        values = values.split(files.DEFAULT_DELIMITER);
    }
    if (typeof values !== 'object') { return false; }
    if (!(values instanceof Array)) { return false; }
    
    var items = [];
    values.forEach(function(v){
        var item = files.cleanExtension(v);
        if (item.length > 0) { items.push(item); }
    });
    items = items.filter(function(ext){
        return (validExtensions.indexOf(ext.toLowerCase()) >= 0);
    });

    return (items.length === values.length);
}
function normalize(options, validExtensions) {
    
    var included = files.toExtensionArray(options.include);
    var excluded = files.toExtensionArray(options.exclude);
    var canceled = validExtensions.filter(function(ext){
        return (options[ext] === false);
    });
    
    if (included.length < 1) { included = validExtensions; }
    
    included = arrays.remove(included, excluded);
    included = arrays.remove(included, canceled);

    return included;
}
