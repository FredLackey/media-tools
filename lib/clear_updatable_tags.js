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
        if (err) { 
            results.failures.metaRead.push(fileInfo);
            return done(); 
        }
        if (!old) { 
            results.failures.metaEmpty.push(fileInfo);
            return done(); 
        }

        if (!old.artist && !old.title && (!_options.fakeAlbum || !old.album)) { 
            results.skipped.push(fileInfo);
            return done(); 
        }

        var meta = JSON.parse(JSON.stringify(old));
        if (old.artist) { meta.artist = ''; }
        if (old.title) { meta.title = ''; }
        if (_options.fakeAlbum && old.album) { meta.album = ''; }
        
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