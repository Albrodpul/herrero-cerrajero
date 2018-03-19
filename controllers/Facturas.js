'use strict';

var url = require('url');

var Ncuentas = require('./FacturasService');

module.exports.getFacturas = function getFacturas (req, res, next) {
  Ncuentas.getFacturas(req.swagger.params, res, next);
};

module.exports.insertFactura = function insertFactura (req, res, next) {
  Ncuentas.insertFactura(req.swagger.params, res, next);
};

module.exports.updateFactura = function updateFactura (req, res, next) {
  Ncuentas.updateFactura(req.swagger.params, res, next);
};

module.exports.deleteFactura = function deleteFactura (req, res, next) {
  Ncuentas.deleteFactura(req.swagger.params, res, next);
};