/* global __dirname */
"use strict";

// ####### DEPENDENCIES #######
var fs = require("fs");
var path = require("path");
var http = require("http");
var bodyParser = require("body-parser");
var express = require("express");
var swaggerTools = require("swagger-tools");
var cors = require("cors");
var helmet = require("helmet");
var methodOverride = require("method-override");
var compression = require("compression");
var jsyaml = require("js-yaml");

var config = require("./config/config");
var logger = require("./config/logConfig");

// ####### EXPRESS INITIALIZATION #######
var app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: "true"
  })
);
app.use(
  bodyParser.json({
    type: "application/vnd.api+json"
  })
);
app.use(methodOverride());
app.use(express.static(__dirname + "/public"));

if (config.use_cors) {
  logger.info("Adding Access-Control-Allow-Origin: *");
  app.use(cors());
}
if (config.use_helmet) {
  logger.info("Improving security using some headers");
  app.use(helmet());
}

// Bypassing 405 status put by swagger when no request handler is defined
app.options("/*", (req, res, next) => {
  return res.sendStatus(200);
});

var serverPort = process.env.PORT || config.port;

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, "/swagger.json"),
  controllers: path.join(__dirname, "./controllers"),
  useStubs: process.env.NODE_ENV === "development" // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, "api/swagger.yaml"), "utf8");
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function() {
    logger.info(
      "Your server is listening on port %d (http://localhost:%d)",
      serverPort,
      serverPort
    );
    logger.info(
      "Swagger-ui is available on http://localhost:%d/docs",
      serverPort
    );
  });
  app.get("/", function(req, res) {
    res.redirect("/docs");
  });
});