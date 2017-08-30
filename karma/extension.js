var configFactory = require('./configFactory')
var PORT = 9879

module.exports = configFactory(function (defaultConfig) {
  var customConfig = Object.assign({}, defaultConfig, {
    port: PORT,

    proxies: {
      '/script.js': `http://localhost:${PORT}/base/test/script.js`
    },
    // list of files / patterns to load in the browser
    // all modules including in tests should be included here
    files: [
      /* targets */

      // contentscript
      { pattern: 'src/extension/contentscript.ts' },

      // devtool sidebar
      { pattern: 'src/extension/Sidebar/*.tsx' },

      /* dependencies */

      // tracker
      { pattern: 'src/tracker/public/*[!(.d)].ts' },
      { pattern: 'src/tracker/private/ActionMap.ts' },

      // test
      { pattern: 'test/actions.ts' },

      /* static */
      { pattern: 'test/script.js', served: true, included: false },

      /* tests */
      { pattern: 'test/extension/**/*.ts' }
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      /* targets */

      // contentscript
      'src/extension/contentscript.ts': ['karma-typescript', 'coverage'],

      // devtool sidebar
      'src/extension/Sidebar/*.tsx': ['karma-typescript', 'coverage'],

      /* dependencies */

      // tracker
      'src/tracker/public/*[!(.d)].ts': ['karma-typescript'],
      'src/tracker/private/ActionMap.ts': ['karma-typescript'],

      // test
      'test/actions.ts': ['karma-typescript'],

      /* tests */
      'test/extension/**/*.ts': ['karma-typescript']
    }
  })
  customConfig.karmaTypescriptConfig.reports.html = 'coverage/extension'

  return customConfig
})
