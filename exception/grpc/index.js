const InvalidLinkAnalysisRequestException = require('../invalid_link_analysis_request');

const grpc = require('grpc');

const uuid = require('uuid').v4;

function isRecognizedError(error) {
  return error instanceof InvalidLinkAnalysisRequestException;
}

function handler(error, callback) {
  if (isRecognizedError(error)) {
    handleRecognisedError(error, callback);
  } else {
    handleUnrecognisedError(error, callback);
  }
}

function handleRecognisedError(error, callback) {
  callback({
    code: grpc.status.INVALID_ARGUMENT,
    details: error.message
  });
}

function handleUnrecognisedError(error, callback) {
  const errorId = uuid();
  console.error(`An unexpected error identified as ${errorId} occurred`, error)
  callback({
    code: grpc.status.INTERNAL,
    details: `An unexpected error occurred. For more details check the app logs for ${errorId}`
  });
}

module.exports = {
  handler,
  handleRecognisedError,
  handleUnrecognisedError,
};