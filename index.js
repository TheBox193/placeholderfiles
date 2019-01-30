#!/usr/bin/env node
var program = require('commander');

const basedir = process.cwd();

program
    .version('0.1.0')
    .option('-d, --destination [destination]', 'Destination folder')
    .parse(process.argv);

var fs = fs || require('fs')

var walkSync = function (dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
        else {
            const newdir = dir.replace(basedir, program.destination)
            filelist.push(newdir + '/' + file);
        }
    });
    return filelist;
};

const filepaths = walkSync(process.cwd());

if (!fs.existsSync(program.destination)) {
    fs.mkdirSync(program.destination);
}

filepaths.forEach(file => {
    let dir = file.split('/');
    dir.pop();
    dir = dir.join('/');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.closeSync(fs.openSync(file, 'w'));    
    console.log('✅  Created: ', file);
});