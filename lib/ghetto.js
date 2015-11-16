'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

let express = require('express');
let defaultConfig = require('./config');
let path = require('path');
let _ = require('lodash');
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let compression = require('compression');
let bodyParser = require('body-parser');

let errorHandler = function (err, req, res, next) {
  next(err);
};

/**
* Global class that encapsulates the application
*/
class Ghetto {

  constructor(config, router) {
    if (config) {
      this.setup(config, router);
    }
  }

  /**
  * Configures the ghetto instance
  *
  * @param {Object} config - user configuration options
  */
  setup(config, router) {
    this.config = _.extend(defaultConfig, config);
    this.router = router;
    this.setupApp();
    this.setupRoutes();
    this.setupMiddleware();
    this.setupSessions();
    this.setupDB();
    errorHandler = this.config.errorHandler || errorHandler;
  }

  /**
  * Setups the express app as this.app with some common options
  */
  setupApp() {
    this.app = express();
    if (this.config.bodyParserOptions.json) {
      this.app.use(bodyParser.json(this.config.bodyParserOptions.json));
    }
    if (this.config.bodyParserOptions.raw) {
      this.app.use(bodyParser.raw(this.config.bodyParserOptions.raw));
    }
    if (this.config.bodyParserOptions.text) {
      this.app.use(bodyParser.text(this.config.bodyParserOptions.text));
    }
    if (this.config.bodyParserOptions.urlencoded) {
      this.app.use(bodyParser.urlencoded(this.config.bodyParserOptions.urlencoded));
    }
    this.app.use(cookieParser(this.config.cookieParserOptions));
    this.app.use(morgan(this.config.morganOptions));
    this.app.use(compression(this.config.compressionOptions));
  }

  /**
  * Setup routes for the application
  */
  setupRoutes() {
    let expressRouter = express.Router();

    for (let route of this.router) {
      let middleware = route[1];
      let methods = route.length == 3 ? route[2].toLowerCase().split(',') : ['get'];
      if (!(middleware instanceof Array)) {
        middleware = [middleware];
      }
      for (let method of methods) {
        expressRouter[method](route[0], middleware.map(this.errorWrapper));
      }
    }
    this.app.use(this.config.mountPoint, expressRouter);
  }

  /**
  * Sets up middleware
  */
  setupMiddleware() {
    if (this.config.middleware) {
      for (middleware of this.middleware) {
        this.app.use(this.errorWrapper(middleware));
      }
    }
  }

  /**
  * Sets up sessions
  */
  setupSessions() {
    if (this.config.session && this.config.sessionOptions) {
      this.app.use(this.config.session(this.config.sessionOptions));
    }
  }

  /**
  * Sets up database
  */
  setupDB() {
    if (this.config.knex) {
      this.knex = require('knex')(this.config.knex);
    }
  }

  /**
  * Wrapper for route to catch all unhandled errors
  *
  * @param {Function} f - The route/middlware to be wrapped
  * @returns {Function} The wrapped route/middleware
  */
  errorWrapper(f) {
    let wrapper = (function () {
      var ref = _asyncToGenerator(function* (req, res, next) {
        f(req, res, next).catch(err => {
          errorHandler(err, req, res, next);
        });
      });

      return function wrapper(_x, _x2, _x3) {
        return ref.apply(this, arguments);
      };
    })();
    return wrapper;
  }

  /**
  * Runs the server
  */
  run(port) {
    port = port || process.GHETTO_PORT || this.config.port;
    this.server = this.app.listen(port, function () {
      console.log(`listening on port ${ port }`);
    });
  }

}

exports.Ghetto = Ghetto;

//# sourceMappingURL=ghetto.js.map