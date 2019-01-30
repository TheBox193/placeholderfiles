#!/usr/bin/env node
var program = require('commander');
var fs = fs || require('fs');

const basedir = process.cwd();

program
	.version('0.1.0')
	.option('-d, --destination [destination]', 'Destination folder')
	.parse(process.argv);

// Build a list of all files recursevly in a directory
const walkSync = function (dir, filelist) {
	var fs = fs || require('fs');
	const files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function (file) {
		if (fs.statSync(dir + '/' + file).isDirectory()) {
			filelist = walkSync(dir + '/' + file, filelist);
		}
		else {
			const newdir = dir.replace(basedir, '')
			filelist.push([newdir, file]);
		}
	});
	return filelist;
};

// Safely create a directory
const makeDir = function (dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

// Make destination dir if it doesn't exit
makeDir(program.destination)

// For all files, create their new folders and 0 byte placeholders
const filepaths = walkSync(basedir);
filepaths.forEach(([dir, file]) => {
	const path = program.destination + dir;
	const filepath = path + '/' + file;
	makeDir(path);
	fs.closeSync(fs.openSync(filepath, 'w'));
	console.log('✅  Created: ', filepath);
});