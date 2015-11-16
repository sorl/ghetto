'use strict'

let express = require('express')
let defaultConfig = require('./config')
let path = require('path')
let _ = require('lodash')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let compression = require('compression')
let bodyParser = require('body-parser')


/**
* Global class that encapsulates the application
*/
class Ghetto {

  constructor(config, router) {
    if(config) {
      this.setup(config, router)
    }
  }

  /**
  * Configures the ghetto instance
  *
  * @param {Object} config - user configuration options
  */
  setup(config, router) {
    this.config = _.extend(defaultConfig, config)
    this.router = router
    this.setupApp()
    this.setupRoutes()
    this.setupMiddleware()
    this.setupSessions()
    this.setupDB()
  }

  /**
  * Setups the express app as this.app with some common options
  */
  setupApp() {
    this.app = express()
    if (this.config.bodyParserOptions.json) {
        this.app.use( bodyParser.json(this.config.bodyParserOptions.json) )
    }
    if (this.config.bodyParserOptions.raw) {
        this.app.use( bodyParser.raw(this.config.bodyParserOptions.raw) )
    }
    if (this.config.bodyParserOptions.text) {
        this.app.use( bodyParser.text(this.config.bodyParserOptions.text) )
    }
    if (this.config.bodyParserOptions.urlencoded) {
        this.app.use( bodyParser.urlencoded(this.config.bodyParserOptions.urlencoded) )
    }
    this.app.use( cookieParser(this.config.cookieParserOptions) )
    this.app.use( morgan(this.config.morganOptions) )
    this.app.use( compression(this.config.compressionOptions) )
  }

  /**
  * Setup routes for the application
  */
  setupRoutes() {
    let expressRouter = express.Router()

    for (let route of this.router) {
      let middleware = route[1]
      let methods = route.length == 3 ? route[2].toLowerCase().split(',') : ['get']
      if(!(middleware instanceof Array)) {
        middleware = [middleware]
      }
      for (let method of methods) {
        expressRouter[method](route[0], middleware.map(this.errorWrapper))
      }
    }
    this.app.use(this.config.mountPoint, expressRouter)
  }

  /**
  * Sets up middleware
  */
  setupMiddleware() {
    if(this.config.middleware) {
      for(middleware of this.middleware) {
        this.app.use(this.errorWrapper(middleware))
      }
    }
  }

  /**
  * Sets up sessions
  */
  setupSessions() {
    if(this.config.session && this.config.sessionOptions) {
      this.app.use(
        this.config.session(this.config.sessionOptions)
      )
    }
  }

  /**
  * Sets up database
  */
  setupDB() {
    if(this.config.knex) {
      this.knex = require('knex')(this.config.knex)
    }
  }

  /**
  * Errorhandler that uses config.errorHandler if defined
  * if not it falls back to express default errorHandler
  */
  errorHandler(err, req, res, next) {
    if(this.config.errorHandler) {
      this.config.errorHandler(err, req, res, err)
    } else {
      next(err)
    }
  }

  /**
  * Wrapper for route to catch all unhandled errors
  *
  * @param {Function} f - The route/middlware to be wrapped
  * @returns {Function} The wrapped route/middleware
  */
  errorWrapper(f) {
    let wrapper = async function(req, res, next) {
      f(req, res, next).catch(err => {
        this.errorHandler(err, req, res, next)
      })
    }
    return wrapper
  }

  /**
  * Runs the server
  */
  run(port) {
    port = port || process.GHETTO_PORT || this.config.port
    this.server = this.app.listen(port, function() {
      console.log(`listening on port ${port}`)
    })
  }

}

exports.Ghetto = Ghetto