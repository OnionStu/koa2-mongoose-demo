var fs = require('fs')
var _ = require('lodash')
var defaultConfig = require('./default')

const cfgs = []
fs.readdirSync(__dirname).map(filename => {
  if (filename === 'index.js') {
    return false
  }
  try {
    const cfg = require('./' + filename)
    if (_.isPlainObject(cfg)) {
      cfgs.push(cfg)
    }
  } catch (e) {}
})
cfgs.push(defaultConfig)

const config = _.defaultsDeep(...cfgs)
module.exports = config
