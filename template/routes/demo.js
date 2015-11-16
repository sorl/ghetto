'use strict'


exports.index = async function(req, res, next) {
  res.send('YOU ARE IN THE GHETTO NOW.')
}

exports.sleep = async function(req, res, next) {
  await require('sleep').sleep(1)
  res.send('DID YOU LIKE TO WAIT?')
}

exports.ohno = async function(req, res, next) {
  throw Error('OH NO!')
}