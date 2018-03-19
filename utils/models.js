"use strict";
var mongoose = require("mongoose");
var config = require("../config/config");
var uri;
if (process.env.NODE_ENV == "development") {
  uri = "mongodb://localhost:27017/herrero-cerrajero";
} else {
  uri = "mongodb://test:test@ds115749.mlab.com:15749/herrero-cerrajero";
}
var promise = mongoose.connect(uri);
// mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var CuentasSchema = new Schema({
  idAdmin: String,
  direccion: String,
  iban: String,
  nif: String,
  referencia: String
});

var FacturasSchema = new Schema({
  fecha: String,
  idAdmin: String,
  direccion: String,
  numero: String,
  estado: String  
})

// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users

// the schema is useless so far
// we need to create a model using it
var nCuentas = mongoose.model("nCuentas", CuentasSchema);
var facturas = mongoose.model("facturas", FacturasSchema);

// make this available to our users in our Node applications
module.exports = {
  nCuentas: nCuentas,
  facturas: facturas
};
