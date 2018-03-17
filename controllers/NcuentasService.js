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

exports.updateCuenta = function (args, res, next) {
  /**
   * Insert a new render
   *
   * render List The render JSON you want to post
   * no response value expected for this operation
   **/
  var ncuenta = args.ncuenta.value;
  var idAdmin = args.idAdmin.value;
  var direccion = args.direccion.value;
  logger.info("Updating document");
  if (!ncuenta[0] || !idAdmin || !direccion || ncuenta[0].idAdmin != idAdmin || ncuenta[0].direccion != direccion) {
    logger.info("Bad Request");
    res.sendStatus(400); // bad request    
  } else {
    if (ncuenta[0].idAdmin && ncuenta[0].direccion && ncuenta[0].iban && Object.keys(ncuenta[0]).length >= 3) {
      if (ncuenta[0].referencia) {
        mongo.updateCuentaNoReferencia(ncuenta, idAdmin, direccion, function (err, flag) {
          if (err) {
            logger.info(err);
            res.sendStatus(500); // internal server error
          } else if (flag) {
            logger.info("Updated!");
            res.sendStatus(200); // created
            res.end();
          } else {
            logger.info("404 Not found");
            res.sendStatus(404); //not found
          }
        });
      } else {
        mongo.updateCuentaReferencia(ncuenta, idAdmin, direccion, function (err, flag) {
          if (err) {
            logger.info(err);
            res.sendStatus(500); // internal server error
          } else if (flag) {
            logger.info("404 Not found");
            res.sendStatus(404); //not found
          } else {
            logger.info("Updated!");
            res.sendStatus(200); // created
            res.end();
          }
        });
      }
    } else {
      logger.info("Unprocessable entity");
      res.sendStatus(422); // unprocessable entity
    }
  }
}

exports.deleteCuenta = function (args, res, next) {
  /**
   * Delete an existing group
   *
   * groupName String Name of an existing group
   * year String An existing year of the group
   * no response value expected for this operation
   **/
  var idAdmin = args.idAdmin.value;
  var direccion = args.direccion.value;
  logger.info("Deleting " + idAdmin + " " + direccion);
  if (!idAdmin || !direccion) {
    logger.info("Bad Request");
    res.sendStatus(400).end();
  } else {
    mongo.deleteCuenta(idAdmin, direccion, function (err, result) {
      if (err) {
        logger.info(err);
        res.sendStatus(500).end(); // internal server error
      } else if (result) {
        logger.info("Deleted!");
        res.sendStatus(204).end(); // no content
      } else {
        logger.info("Not found");
        res.sendStatus(404).end(); // not found
      }
    });
  }
};