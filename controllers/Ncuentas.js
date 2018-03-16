'use strict';

var url = require('url');

var Ncuentas = require('./NcuentasService');

module.exports.getCuentas = function getCuentas (req, res, next) {
  Ncuentas.getCuentas(req.swagger.params, res, next);
};

module.exports.insertCuenta = function insertCuenta (req, res, next) {
  Ncuentas.insertCuenta(req.swagger.params, res, next);
};

module.exports.getCuentaLast = function getCuentaLast (req, res, next) {
  Ncuentas.getCuentaLast(req.swagger.params, res, next);
};