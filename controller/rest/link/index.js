const { InvalidLinkAnalysisRequestException } = require('../../../exception');

class LinkRestController {
  constructor(
    linkAnalyzer,
    validator = require('../../../validator')
  ) {
    this.linkAnalyzer = linkAnalyzer;
    this.validator = validator
  }

  registerHandlers(expressApp) {
    expressApp.post('/links/analyze', this.handleAnalyzeLink.bind(this));
  }

  async handleAnalyzeLink(request, response, next) {
    try {
      const { link } = request.body;
      if (!link || !this.validator.isValidLink(link)) {
        throw new InvalidLinkAnalysisRequestException();
      } else {
        const analysis = await this.linkAnalyzer.analyze(link)
        response.status(200).json(analysis);
      }
    } catch (error) {
      console.error('Failed to process link analysis request', error);
      next(error);
    }
  }
}

module.exports = LinkRestController;