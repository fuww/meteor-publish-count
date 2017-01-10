/* eslint-env es6:false */
/* eslint-disable prefer-arrow-callback */

Package.describe({
  summary: 'Package for publishing counts',
  version: '0.0.1',
  name: 'fuww:publish-count',
  git: 'https://github.com/fuww/meteor-publish-count.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use([
    'ecmascript@0.4.0',
    'meteor'
  ]);

  api.mainModule('client/main.js', 'client');
  api.mainModule('server/main.js', 'server');

  api.export([
    'PublishCount'
  ]);

  api.export([
    'Count'
  ], 'client');

  api.export([
    'publishCount'
  ], 'server');
});
