"use strict";

module.exports = {
  getCuentas: getCuentas,
  getCuentasByAdmin: getCuentasByAdmin,
  getCuentasByDireccion: getCuentasByDireccion,
  getCuentaLast: getCuentaLast,
  insertCuenta: insertCuenta,
  updateCuentaNoReferencia: updateCuentaNoReferencia,
  updateCuentaReferencia: updateCuentaReferencia,
  deleteCuenta: deleteCuenta
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
  modelsMongo.nCuentas.find({},
    function (err, data) {
      if (err) {
        callback(err, null); //internal server error
      } else {
        if (data.length > 0) {
          var referenciaList = [];
          var referenciList = [];
          var json = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].referencia) {
              if (letterCounter(data[i].referencia) == 10) {
                referenciaList.push(data[i]);
              }
              if (letterCounter(data[i].referencia) == 9) {
                referenciList.push(data[i]);
              }
            }
          }
          if (referenciList.length > 0) {
            referenciList.sort(function (a, b) {
              return a.referencia.localeCompare(b.referencia, "en", {
                numeric: true
              });
            });
            json=referenciList;
          } else {
            referenciaList.sort(function (a, b) {
              return a.referencia.localeCompare(b.referencia, "en", {
                numeric: true
              });
            });
            json=referenciaList;
          }
          callback(null, json[json.length-1]); //get group
        } else {
          callback(null, null); //not found
        }
      }
    });
}

function letterCounter(str) {
  var letters = 0;
  var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var ar = alphabet.split("");
  for (var i = 0; i < str.length; i++) {
    if (ar.indexOf(str[i]) > -1) {
      letters = letters + 1;
    }
  }
  return letters;
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

function updateCuentaNoReferencia(updateData, idAdmin, direccion, callback) {
  modelsMongo.nCuentas.find({
    "idAdmin": idAdmin,
    "direccion": direccion
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        modelsMongo.nCuentas.update({
          "idAdmin": idAdmin,
          "direccion": direccion
        }, {
          $set: {
            "nif": updateData[0].nif,
            "iban": updateData[0].iban
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

function updateCuentaReferencia(updateData, idAdmin, direccion, callback) {
  modelsMongo.nCuentas.find({
    "idAdmin": idAdmin,
    "direccion": direccion
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else {
      if (data.length > 0) {
        modelsMongo.nCuentas.update({
          "idAdmin": idAdmin,
          "direccion": direccion,
          "referencia": data[0].referencia
        }, {
          $set: {
            "nif": updateData[0].nif,
            "iban": updateData[0].iban
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

function deleteCuenta(idAdmin, direccion, callback) {
  modelsMongo.nCuentas.find({
    "idAdmin": idAdmin,
    "direccion": direccion
  }, function (err, data) {
    if (err) {
      callback(err, null); //internal server error
    } else if (data.length == 0) {
      callback(null, null); //not found
    } else {
      modelsMongo.nCuentas.remove({
        "idAdmin": idAdmin,
        "direccion": direccion
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