var configFactory = require('./configFactory')
var PORT = 9877

module.exports = configFactory(function (defaultConfig) {
  var customConfig = Object.assign({}, defaultConfig, {
    port: PORT,
    // list of files / patterns to load in the browser
    // all modules including in tests should be included here
    files: [
      /* targets */
      { pattern: 'src/tracker/trackers/*/*[!(.d)].ts' },
      { pattern: 'src/tracker/private/*[!(.d)].ts' },

      /* dependencies */
      { pattern: 'src/tracker/trackers/utils.ts' },
      { pattern: 'src/tracker/public/*[!(.d)].ts' },

      /* tests */
      { pattern: 'test/tracker/trackers/*.ts' }
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      /* targets */
      'src/tracker/trackers/*/*[!(.d)].ts': ['karma-typescript', 'coverage'],
      'src/tracker/private/*[!(.d)].ts': ['karma-typescript', 'coverage'],

      /* dependencies */
      'src/tracker/trackers/utils.ts': ['karma-typescript'],
      'src/tracker/public/*[!(.d)].ts': ['karma-typescript'],

      /* tests */
      'test/tracker/trackers/*.ts': ['karma-typescript']
    }
  })
  customConfig.karmaTypescriptConfig.reports.html = 'coverage/tracker'

  return customConfig
})
