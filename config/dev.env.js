var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"/api"'   //代理设置的url
  // BASE_API: '"http://192.168.2.233:6688"'
  BASE_API: '"http://qxw1590760484.my3w.com"'
})
