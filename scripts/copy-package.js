var fs = require('fs');

var packageJson = require('../package.json');
if (! packageJson) {
  throw new Error('Can\'t find package json');
}

delete packageJson.devDependencies;
delete packageJson.scripts;

fs.writeFile('./dist/package.json', JSON.stringify(packageJson, null, 2));
