class InvalidLinkAnalysisRequestException extends Error {
  constructor(message) {
    super(message);
    this.code = 1;
  }
}

module.exports = InvalidLinkAnalysisRequestException;