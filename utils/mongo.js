"use strict";

module.exports = {
  getCuentas: getCuentas,
  getCuentasByAdmin: getCuentasByAdmin,
  getCuentasByDireccion: getCuentasByDireccion,
  getCuentaLast: getCuentaLast,
  insertCuenta: insertCuenta
};

const assert = require("assert");
var mongoose = require("mongoose");

var modelsMongo = require("../utils/models");
var config = require("../config/config");

var logger = require("../config/logConfig");

var port = process.env.PORT || 8080;
var uri;
if (port == 8080) {
  uri = "mongodb://localhost:27017/herrero-cerrajero";
} else {
  uri = "mongodb://test:test@ds115749.mlab.com:15749/herrero-cerrajero";
}

mongoose.Promise = global.Promise;

var promise = mongoose.connect(uri);

function getCuentas(callback) {
  modelsMongo.nCuentas.find({}, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      callback(null, data); //get cuentas
    }
  });
}

function getCuentasByAdmin(idAdmin, callback) {
  modelsMongo.nCuentas.find({
    "idAdmin": idAdmin
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        callback(null, data); //get cuentas
      } else {
        callback(null, null); //not found
      }
    }
  });
}

function getCuentasByDireccion(direccion, callback) {
  modelsMongo.nCuentas.find({
    "direccion": direccion
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        callback(null, data); //get cuentas
      } else {
        callback(null, null); //not found
      }
    }
  });
}

function getCuentaLast(callback) {
  modelsMongo.nCuentas.find({}, [], {
    limit: 1,
    sort: {
      referencia: -1
    }
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        callback(null, data); //get group
      } else {
        callback(null, null); //not found
      }
    }
  });
}

function insertCuenta(newData, callback) {
  var idAdmin = newData[0].idAdmin;
  var direccion = newData[0].direccion;
  modelsMongo.nCuentas.find({
    "idAdmin": idAdmin,
    "direccion": direccion
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        callback(null, data); //conflict
      } else {
        modelsMongo.nCuentas.collection.insert(newData, {
          ordered: true
        }, function (err) {
          if (err) {
            callback(err, null); //internal server error
          } else {
            callback(null, null); //created
          }
        });
      }
    }
  })
}