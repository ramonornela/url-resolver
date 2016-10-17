var fs = require('fs');
var process = require('process');
var path = require('path');

var packageJson = require(path.join('..', 'package.json'));
var readme = fs.readFileSync(path.join(process.cwd(), 'README.md'));
var license = fs.readFileSync(path.join(process.cwd(), 'LICENSE'));

if (! packageJson) {
  throw new Error('Can\'t find package json');
}

if (! readme) {
  throw new Error('Can\'t find README.md');
}

if (! license) {
  throw new Error('Can\'t find LICENSE');
}

delete packageJson.devDependencies;
delete packageJson.scripts;

fs.writeFile('./dist/package.json', JSON.stringify(packageJson, null, 2));
fs.writeFile('./dist/REAME.md', readme);
fs.writeFile('./dist/LICENSE', license);
