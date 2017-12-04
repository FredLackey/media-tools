module.exports = {
    remove              : remove,
    removeEmpty         : removeEmpty,
    removeDuplicates    : removeDuplicates
};

function removeEmpty(values) {
    return [].concat(values).filter(function(v){
        return (v !== null &&
                (typeof v !== 'undefined') &&
                (typeof v !== 'string' || v.trim().length > 0));
    });
}
function remove(values, valuesToRemove, isCaseSensitive) {
    if (typeof isCaseSensitive !== 'boolean') { isCaseSensitive = false; }
    var result = [].concat(values).filter(function(value){
        var match = [].concat(valuesToRemove).find(function(v){
            if ((typeof v) !== (typeof value)) { 
                return false; 
            } else if (typeof v !== 'string') {
                return (v === value);
            } else if (isCaseSensitive) {
                return v === value;
            } else {
                return v.toLowerCase() === value.toLowerCase();
            }
        });
        return match ? false : true;
    });
    return result;
}
function removeDuplicates(values, isCaseSensitive) {
    if (typeof isCaseSensitive !== 'boolean') { isCaseSensitive = false; }
    values = [].concat(values);
    var result = [];
    var lower = [];
    for (var i = 0; i < values.length; i += 1) {
        if (values[i] === null) { continue; }
        if (typeof values[i] === 'undefined') { continue; }
        if (typeof values[i] === 'string') {
            if (values[i].trim().length < 1) { continue; }
            if (isCaseSensitive) {
                if (result.indexOf(values[i].trim()) >= 0) { continue; }
            } else {
                if (lower.indexOf(values[i].toLowerCase().trim()) >= 0) { continue; }
                lower.push(values[i].toLowerCase().trim());
            }
            result.push(values[i].trim());
        } else {
            if (result.indexOf(values[i]) >= 0) { continue; }
            result.push(values[i]);
        }
    }
    return result;
}
