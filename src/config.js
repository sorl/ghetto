'use strict'


let cookieSession = require('cookie-session')


module.exports = {
  session: cookieSession,
  sessionOptions: {},
  bodyParserOptions: {},
  cookieParserOptions: {},
  compressionOptions: {},
  morganOptions: 'combined',
  mountPoint: '/',
  port: 4100,
}