'use strict';

const request = require("request");
const Promise = require("bluebird");

const mongo = require("../utils/mongoFacturas");
const config = require("../config/config");
const logger = require("../config/logConfig");

exports.getFacturas = function (args, res, next) {
  /**
   * Devuelve los números de cuentas
   *
   * returns List
   **/
  var idAdmin = args.idAdmin.value;
  var direccion = args.direccion.value;
  logger.info("Get " + idAdmin + " " + direccion);
  if (!idAdmin && !direccion) {
    logger.info("Get Facturas");
    mongo.getFacturas(function (err, data) {
      if (err) {
        logger.info(err);
        res.sendStatus(500); // internal server error
      } else {
        logger.info("Get!");
        res.send(data);
      }
    });
  } else if (idAdmin && !direccion) {
    mongo.getFacturasByAdmin(idAdmin, function (err, data) {
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
    mongo.getFacturasByDireccion(direccion, function (err, data) {
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

exports.insertFactura = function (args, res, next) {
  /**
   * Insert a new render
   *
   * render List The render JSON you want to post
   * no response value expected for this operation
   **/
  var factura = args.factura.value;
  logger.info("Inserting document");
  if (!factura[0]) {
    logger.info("Bad Request");
    res.sendStatus(400); // bad request    
  } else {
    if (factura[0].fecha && factura[0].idAdmin && factura[0].direccion && factura[0].numero && factura[0].estado && Object.keys(factura[0]).length == 5) {
      mongo.insertFactura(factura, function (err, data) {
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

exports.updateFactura = function (args, res, next) {
  /**
   * Insert a new render
   *
   * render List The render JSON you want to post
   * no response value expected for this operation
   **/
  var factura = args.factura.value;
  var numero = args.numero.value;
  logger.info("Updating document");
  if (!factura[0] || !numero || factura[0].numero != numero) {
    logger.info("Bad Request");
    res.sendStatus(400); // bad request    
  } else {
    if (factura[0].fecha && factura[0].idAdmin && factura[0].direccion && factura[0].numero && factura[0].estado && Object.keys(factura[0]).length == 5) {
        mongo.updateFactura(factura, numero, function (err, flag) {
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
      logger.info("Unprocessable entity");
      res.sendStatus(422); // unprocessable entity
    }
  }
}

exports.deleteFactura = function (args, res, next) {
  /**
   * Delete an existing group
   *
   * groupName String Name of an existing group
   * year String An existing year of the group
   * no response value expected for this operation
   **/
  var numero = args.numero.value;
  logger.info("Deleting " + numero);
  if (!numero) {
    logger.info("Bad Request");
    res.sendStatus(400).end();
  } else {
    mongo.deleteFactura(numero, function (err, result) {
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