const express = require('express');
const bodyParser = require('body-parser');

const { LinkController, HealthController } = require('./controller');
const errorHandler = require('./middleware').error.handler;

const LinkAnalyzerService = require('./service/link_analyzer');

async function init() {
  const expressApp = setupExpress();
  const browser = await setupBrowser();
  addHandlers(expressApp, new LinkAnalyzerService(browser));
  listen(expressApp);
}

function setupExpress() {
  const expressApp = express();
  expressApp.use(bodyParser.json());
  return expressApp;
}

function setupBrowser(
  puppeteer = require('puppeteer'),
) {
  return puppeteer.launch();
}

function addHandlers(expressApp, linkAnalyzer) {
  new LinkController(linkAnalyzer).registerHandlers(expressApp);
  new HealthController().registerHandlers(expressApp);

  expressApp.use(errorHandler);
}

function listen(expressApp, port=process.env.PORT) {
  if (port) {
    expressApp.listen(port);
  } else {
    console.warn('$PORT was not set so 8080 was assumed');
    expressApp.listen(8080);
  }
}

init();