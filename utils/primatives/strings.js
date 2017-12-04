var ALPHA = 'abcdefghijklmnopqrstuvwxyz';
var NUMBERS = '0123456789';
var ALPHANUMERIC = ALPHA + ALPHA.toUpperCase() + NUMBERS;

module.exports = {
    ifValid     : ifValid,
    isValid     : isValid,
    trimStrict  : trimStrict,
    count       : count,

    ALPHA           : ALPHA,
    NUMBERS         : NUMBERS,
    ALPHANUMERIC    : ALPHANUMERIC
};

function ifValid(value, defaultValue){
    return isValid(value) ? value : defaultValue;
}
function isValid(value){
    return (typeof(trimStrict(value)) === 'string');
}
function trimStrict(value){
    if (typeof value !== 'string') { return undefined; }
    value = value.trim();
    return (value.length > 0) ? value : undefined; 
}
function count(value, target) {
    return (value.match(RegExp(target, 'g')) || []).length;
}