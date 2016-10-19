var fs = require('fs');
var process = require('process');
var path = require('path');

var packageJson = require(path.join('..', 'package.json'));

if (! packageJson) {
  throw new Error('Can\'t find package json');
}

delete packageJson.devDependencies;
delete packageJson.dependencies;
delete packageJson.scripts;

fs.writeFile('./dist/package.json', JSON.stringify(packageJson, null, 2));
