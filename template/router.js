'use strict'


let demo = require('./routes/demo')


module.exports = [
  ['/', demo.index],
  ['/sleep', demo.sleep, 'GET,POST'],
  ['/ohno', demo.ohno, 'ALL']
]