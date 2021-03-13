const { InvalidLinkAnalysisRequestException, grpcErrorHandler } = require('../../../exception');

class LinkGrpcController {
  constructor(
    linkAnalyzer,
    validator = require('../../../validator')
  ) {
    this.linkAnalyzer = linkAnalyzer;
    this.validator = validator

    this.handleAnalyzeLink = this.handleAnalyzeLink.bind(this)
  }

  async handleAnalyzeLink(call, callback) {
    try {
      const { link } = call.request;
      if (!link || !this.validator.isValidLink(link)) {
        throw new InvalidLinkAnalysisRequestException();
      } else {
        const analysis = await this.linkAnalyzer.analyze(link);
        callback(null, analysis);
      }
    } catch (error) {
      console.error(`Failed to process link analysis request`, error);
      grpcErrorHandler(error, callback);
    }
  }
}

module.exports = LinkGrpcController;