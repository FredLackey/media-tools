#!/usr/bin/env node

'use strict';

var _       = require('../utils');
var chalk   = require('chalk');
var lib     = require('../lib');
var log     = console.log;

const program   = require('commander');

program
    .version('0.0.0')
    .usage('[options] <path>')
    .description('clears updatable tags from media files')
    .option('-l, --log-path <path>', 'logging folder (default: ./.logs)')
    .option('-x, --exclude [extensions]', 'file extensions to exclude')
    .option('-i, --include [extensions]', 'file extensions to include')

    .option('--fake-album', 'use track for album if not available')

    .option('--no-asf', 'ignore ASF files')
    .option('--no-avi', 'ignore AVI files')
    .option('--no-flv', 'ignore FLV files')
    .option('--no-mp3', 'ignore MP3 files')
    .option('--no-mp4', 'ignore MP4 files')
    .option('--no-m4a', 'ignore M4A files')
    .option('--no-wma', 'ignore M4A files')
    .option('--no-wmv', 'ignore WMV files')
    .action(function(root, options){

        if (!lib) {  
            log(_.colors.ERR('media-tools-lib is not installed ... quitting')); 
        } else {

            var exts = _.extensions.normalize(options, lib.VALID_EXTENSIONS);
            options.exts = exts;
            
            if (options.include && !_.extensions.isValid(options.include, lib.VALID_EXTENSIONS)) {
                log(chalk.red('included extensions contains invalid values ... quitting')); 
            }
            else if (options.exclude && !_.extensions.isValid(options.exclude, lib.VALID_EXTENSIONS)) {
                log(chalk.red('excluded extensions contains invalid values ... quitting')); 
            }
            else if (exts.length < 1 && !_.extensions.isEmpty(options.include) && !_.extensions.isEmpty(options.exclude)) {
                log(chalk.red('exclusions canceled all options ... quitting')); 
            } else {

               lib.clearUpdatableTags.process(root, options, function(err, results){
                    if (err) { chalk.red(err); }
                    else { 

                        var color;
                        switch(_.results.getLevel(results)) {
                            case 1:
                                color = chalk.green;
                                break;
                            case 2:
                                color = chalk.yellow;
                                break;
                            case 3:
                                color = chalk.red;
                                break;
                            default:
                                color = chalk.white;
                        }

                        log(color('Process complete.'));

                        log(color(' > ELIGIBLE: %s'), results.found.length);
                        if (results.failures.invalidName.length > 0) {
                            log(color(' > SKIPPED : %s (%s)'), results.failures.invalidName.length, 'name not available (use force)');
                        }
                        if (results.failures.metaRead.length > 0) {
                            log(color(' > FAILED  : %s (%s)'), results.failures.metaRead.length, 'err reading meta');
                        }
                        if (results.failures.metaEmpty.length > 0) {
                            log(color(' > FAILED  : %s (%s)'), results.failures.metaEmpty.length, 'no meta data');
                        }
                        if (results.failures.metaWrite.length > 0) {
                            log(color(' > FAILED  : %s (%s)'), results.failures.metaWrite.length, 'meta data not written');
                        }
                        if (results.skipped.length > 0) {
                            log(color(' > SKIPPED : %s (%s)'), results.skipped.length, 'not needed - already clear');
                        }
                        if (results.success.length > 0) {
                            log(color(' > SUCCESS : %s'), results.success.length);                        
                        }
                    }
                });
            }
        }
    })
    .parse(process.argv);

if (!program.args || program.args.length < 1) { 
    program.help();
}

