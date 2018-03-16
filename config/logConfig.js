/*!
sabius 0.0.1, built on: 2017-10-03
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-service-sabius

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

"use strict";
var winston = require("winston");
var config = require("./config");

winston.emitErrs = true;

var logConfig = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 6
  },
  colors: {
    error: "red",
    warning: "yellow",
    info: "blue",
    debug: "black"
  }
};

var logger = new winston.Logger({
  levels: logConfig.levels,
  colors: logConfig.colors,
  transports: [
    new winston.transports.File({
      level: "info",
      filename: config.logFile,
      handleExceptions: true,
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: "info",
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
});
module.exports = logger;
module.exports.stream = {
  write: function(message) {
    logger.info(message);
  }
};
