'use strict';

const request = require("request");
const Promise = require("bluebird");

const mongo = require("../utils/mongo");
const config = require("../config/config");
const logger = require("../config/logConfig");

exports.getCuentas = function (args, res, next) {
  /**
   * Devuelve los números de cuentas
   *
   * returns List
   **/
  var idAdmin = args.idAdmin.value;
  var direccion = args.direccion.value;
  logger.info("Get " + idAdmin + " " + direccion);
  if (!idAdmin && !direccion) {
    logger.info("Get Cuentas");
    mongo.getCuentas(function (err, data) {
      if (err) {
        logger.info(err);
        res.sendStatus(500); // internal server error
      } else {
        logger.info("Get!");
        res.send(data);
      }
    });
  } else if (idAdmin && !direccion) {
    mongo.getCuentasByAdmin(idAdmin, function (err, data) {
      if (err) {
        logger.info(err);
        res.sendStatus(500); // internal server error
      } else if (data) {
        logger.info("Get!");
        res.send(data);
      } else {
        logger.info("Not found");
        res.sendStatus(404);
      }
    });
  } else if (!idAdmin && direccion) {
    mongo.getCuentasByDireccion(direccion, function (err, data) {
      if (err) {
        logger.info(err);
        res.sendStatus(500); // internal server error
      } else if (data) {
        logger.info("Get!");
        res.send(data);
      } else {
        logger.info("Not found");
        res.sendStatus(404);
      }
    });
  } else if (idAdmin && direccion) {
    logger.info("Bad request");
    res.sendStatus(400); // bad request
  }
}

exports.getCuentaLast = function (args, res, next) {
  /**
   * Devuelve los números de cuentas
   *
   * returns List
   **/
  logger.info("Get última cuenta");
  mongo.getCuentaLast(function (err, data) {
    if (err) {
      logger.info(err);
      res.sendStatus(500); // internal server error
    } else {
      logger.info("Get!");
      res.send(data);
    }
  });
}

exports.insertCuenta = function (args, res, next) {
  /**
   * Insert a new render
   *
   * render List The render JSON you want to post
   * no response value expected for this operation
   **/
  var ncuenta = args.ncuenta.value;
  logger.info("Inserting document");
  if (!ncuenta[0]) {
    logger.info("Bad Request");
    res.sendStatus(400); // bad request    
  } else {
    if (ncuenta[0].idAdmin && ncuenta[0].direccion && ncuenta[0].iban && Object.keys(ncuenta[0]).length >= 3) {
      mongo.insertCuenta(ncuenta, function (err, data) {
        if (err) {
          logger.info(err);
          res.sendStatus(500); // internal server error
        } else if (data) {
          logger.info("409 Conflict");
          res.sendStatus(409); //conflict
        } else {
          logger.info("Saved!");
          res.sendStatus(201); // created
          res.end();
        }
      });
    } else {
      logger.info("Unprocessable entity");
      res.sendStatus(422); // unprocessable entity
    }
  }
}