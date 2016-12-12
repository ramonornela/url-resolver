#!/usr/bin/env node

var changelog = require('conventional-changelog');
var GithubApi = require('github');
var packageJSON = require('../package.json');
var through = require('through2');
var token = process.argv[2] ? process.argv[2] : null;

var github = new GithubApi({
  version: '3.0.0'
});

github.authenticate({
  type: 'oauth',
  token: token || process.env.GH_TOKEN
});


return changelog({
  preset: 'angular'
})
.pipe(through.obj(function(file) {
  github.releases.createRelease({
    owner: 'ramonornela',
    repo: 'configuration',
    target_commitish: 'master',
    tag_name: 'v' + packageJSON.version,
    name: packageJSON.version,
    body: file.toString(),
    prerelease: false
  }, function(err, data) {
    if (err) console.log('error: ' + err);
    console.log(data);
  });
}));
