const InvalidLinkAnalysisRequestException = require('../invalid_link_analysis_request');

const uuid = require('uuid').v4;

function isRecognizedError(error) {
  return error instanceof InvalidLinkAnalysisRequestException;
}

function handler(error, _, response, __) {
  if (isRecognizedError(error)) {
    handleRecognisedError(error, response);
  } else {
    handleUnrecognisedError(error, response);
  }
}

function handleRecognisedError(error, response) {
  response.status(400).json({
    errors: [
      {
        code: error.code,
        message: error.message
      }
    ]
  });
}

function handleUnrecognisedError(error, response) {
  const errorId = uuid();
  console.error(`An unexpected error identified as ${errorId} occurred`, error)
  response.status(500).json({
    errors: [
      {
        code: 0,
        message: `An unexpected error occurred. For more details check the app logs for ${errorId}`
      }
    ]
  });
}

module.exports = {
  handler,
  handleRecognisedError,
  handleUnrecognisedError,
};