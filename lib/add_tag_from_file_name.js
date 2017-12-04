var _       = require('../utils');
var async   = require('async');
var ff      = require('ffmetadata');

var _options;

module.exports = {
    process : process
};

var results = {
    found   : [],
    success : [],
    skipped : [],
    failures : {
        invalidName : [],
        metaEmpty   : [],
        metaRead    : [],
        metaWrite   : []
    }
};

function process(root, options, done) {

    _options = options;

    var e = [];
    options.exts.forEach(ext => {
        if (e.indexOf('*.' + ext.toLowerCase()) < 0) {
            e.push('*.' + ext.toLowerCase());
        }
    });

    _.files.find(root, e, function(err, files){
        if (err) { return done(err); }
        if (files.length < 1) { return done(); }

        async.each(files, processFile, function(){
            return done(null, results);
        });
    });
}

function processFile (fileInfo, done) {
    
    results.found.push(fileInfo);

    var nameDetails = _.metaData.fromFileName(fileInfo.name);
    if (!nameDetails) { 
        results.failures.invalidName.push(fileInfo);
        return done();
    }

    ff.read(fileInfo.fullPath, function(err, old){

        console.log('-----');
        console.log(JSON.stringify(old, null, 2));


        if (err) { 
            results.failures.metaRead.push(fileInfo);
            return done(); 
        }
        if (!old) { 
            results.failures.metaEmpty.push(fileInfo);
            return done(); 
        }
        if (_.strings.isValid(old.artist) && _.strings.isValid(old.title)) { 
            results.skipped.push(fileInfo);
            return done(); 
        }

        var meta = {};
        Object.keys(old).forEach(function(key){
            if (typeof old[key] === 'string' && old[key].trim().length > 0) {
                meta[key] = old[key].trim();
            }
        });

        if (!meta.artist || !_.metaData.isValidName(meta.artist)) {
            meta.artist = nameDetails.artist;
        }
        if (!meta.title || !_.metaData.isValidName(meta.title)) {
            meta.title = nameDetails.fullTitle || nameDetails.title;
        }
        if ((!meta.album || !_.metaData.isValidName(meta.album)) && (nameDetails.album || (_options.fakeAlbum && nameDetails.title))) {
            meta.album = nameDetails.album || nameDetails.title;
        }

        // meta.artist = _.metaData.cleanName()
        // meta.title = _.metaData.cleanName(meta.title) || nameDetails.fullTitle || nameDetails.title;

        // var meta = JSON.parse(JSON.stringify(old));
        // meta.title  = _.metaData.isValidName(meta.title) ? _.metaData.cleanName(meta.title) : (nameDetails.fullTitle || nameDetails.title);
        // meta.artist = _.metaData.isValidName(meta.artist) ? _.metaData.cleanName(meta.artist) : nameDetails.artist;
        // if (_options.fakeAlbum && meta.title) {
        //     meta.album  = _.metaData.isValidName(meta.album) ? _.metaData.cleanName(meta.album) : meta.title;
        // }

        // if (typeof meta.title === 'undefined' || meta.title === 'undefined') {
        //     console.log('----------');
        //     console.log(JSON.stringify(fileInfo, null, 2));
        //     console.log(JSON.stringify(old, null, 2));
        //     console.log(JSON.stringify(meta, null, 2));
        // }

        ff.write(fileInfo.fullPath, meta, function(err){
            if (err) {
                results.failures.metaWrite.push(fileInfo);
            } else { 
                results.success.push(fileInfo);
            }

            return done();
        });
    });
}