const createPropDispatcher = require('../createPropDispatcher')

/* browserify can't resolve dynamic path */
module.exports = createPropDispatcher([
  require('../../checkers/Attr/prop/mani')
])
