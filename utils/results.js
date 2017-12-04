var INFO_LEVEL = 0;
var SUCCESS_LEVEL = 1;
var WARN_LEVEL = 2
var ERROR_LEVEL = 3;

module.exports = {
    getLevel : getLevel
}

function getLevel(res) {
    if (res.skipped.length === res.found.length) { return SUCCESS_LEVEL; }
    else if (hasErrors(res)) {
        if (hasSuccess(res) || hasSkipped(res)) { return WARN_LEVEL; }
        else { return ERROR_LEVEL };
    }
    else { return INFO_LEVEL; }
}

function hasSuccess(res){
    return (res.success.length || (res.found.length === res.skipped.length));
}
function hasFound(res) {
    return (res.found.length > 0);
}
function hasSkipped(res) {
    return (res.skipped.length > 0);
}
function hasErrors(res) {
    return (res.failures.invalidName.length > 0 ||
        res.failures.metaRead.length > 0 ||
        res.failures.metaEmpty.length > 0 ||
        res.failures.metaWrite.length > 0);
}