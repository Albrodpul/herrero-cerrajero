"use strict";

module.exports = {
  getFacturas: getFacturas,
  getFacturasByAdmin: getFacturasByAdmin,
  getFacturasByDireccion: getFacturasByDireccion,
  insertFactura: insertFactura,
  updateFactura: updateFactura,
  deleteFactura: deleteFactura
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

function getFacturas(callback) {
  modelsMongo.facturas.find({}, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      callback(null, data); //get cuentas
    }
  });
}

function getFacturasByAdmin(idAdmin, callback) {
  modelsMongo.facturas.find({
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

function getFacturasByDireccion(direccion, callback) {
  modelsMongo.facturas.find({
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

function insertFactura(newData, callback) {
  var numero = newData[0].numero;
  modelsMongo.facturas.find({
    "numero": numero
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        callback(null, data); //conflict
      } else {
        modelsMongo.facturas.collection.insert(newData, {
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

function updateFactura(updateData, numero, callback) {
  modelsMongo.facturas.find({
    "numero": numero
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        modelsMongo.facturas.update({
          "idAdmin": data[0].idAdmin,
          "direccion": data[0].direccion,
          "numero": numero
        }, {
          $set: {
            "fecha": updateData[0].fecha,
            "estado": updateData[0].estado
          }
        }, function (err) {
          if (err) {
            callback(err, null); //internal server error
          } else {
            callback(null, data); //updated
          }
        });
      } else {
        callback(null, null); //not found
      }
    }
  })
}

function deleteFactura(numero, callback) {
  modelsMongo.facturas.find({
    "numero": numero
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else if (data.length == 0) {
      callback(null, null); //not found
    } else {
      modelsMongo.facturas.remove({
        "numero": numero
      }, function (err, result) {
        if (err) {
          callback(err, null); //internal server error
        } else {
          callback(null, result); //deleted
        }
      });
    }
  });
}