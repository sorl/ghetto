'use strict'


let Ghetto = require('ghetto').Ghetto
let config = require('./config')
let router = require('./router')


let ghetto = new Ghetto(config, router)
// customize your ghetto instance here if needed


ghetto.run()