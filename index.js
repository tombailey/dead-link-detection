const express = require('express');
const bodyParser = require('body-parser');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const { LinkRestController, HealthRestController } = require('./controller/rest');
const { LinkGrpcController } = require('./controller/grpc');
const restErrorHandler = require('./exception').restErrorHandler;

const LinkAnalyzerService = require('./service/link_analyzer');

async function init() {
  const browser = await setupBrowser();
  const linkAnalyzerService = new LinkAnalyzerService(browser)

  setupExpress(linkAnalyzerService);
  setupGrpc(linkAnalyzerService);
}

function setupBrowser(
  puppeteer = require('puppeteer'),
) {
  return puppeteer.launch();
}

function setupExpress(linkAnalyzer, port=process.env.REST_PORT) {
  const expressApp = express();
  expressApp.use(bodyParser.json());

  new LinkRestController(linkAnalyzer).registerHandlers(expressApp);
  new HealthRestController().registerHandlers(expressApp);

  expressApp.use(restErrorHandler);

  if (port) {
    expressApp.listen(port);
  } else {
    console.warn('$REST_PORT was not set so 8080 was assumed');
    expressApp.listen(8080);
  }

  return expressApp;
}

function setupGrpc(linkAnalyzerService, port=process.env.GRPC_PORT) {
  const packageDefinition = protoLoader.loadSync('./definitions.proto', {
    keepCase: true,
    enums: String
  });
  const definitions = grpc.loadPackageDefinition(packageDefinition);

  const server = new grpc.Server();

  const linkGrpcController = new LinkGrpcController(linkAnalyzerService);
  server.addService(definitions.LinkAnalyzerService.service, {
    analyze: linkGrpcController.handleAnalyzeLink
  });

  if (port) {
    server.bind(`localhost:${port}`, grpc.ServerCredentials.createInsecure());
  } else {
    console.warn('$GRPC_PORT was not set so 8081 was assumed');
    server.bind('localhost:8081', grpc.ServerCredentials.createInsecure());
  }
  server.start();
}

init();