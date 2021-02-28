class LinkAnalyzerService {
  constructor(
    browser,
    LinkAnalysis = require('../model/link_analysis')
  ) {
    this.browser = browser;
    this.LinkAnalysis = LinkAnalysis;
  }

  async analyze(link) {
    try {
      const response = await this.visit(link);
      if (response == null) {
        //about:blank treated as an error
        return this.LinkAnalysis.NETWORK_ERROR;
      } else if (!response.ok()) {
        if (response.status() === 404) {
          return this.LinkAnalysis.CONTENT_MISSING;
        } else {
          return this.LinkAnalysis.NETWORK_ERROR;
        }
      } else {
        //TODO: check title/body for "not found" and similar text
        return this.LinkAnalysis.WORKING;
      }
    } catch (error) {
      const analysis = this.errorToAnalysis(error);
      if (analysis) {
        return analysis;
      } else {
        throw error;
      }
    }
  }

  errorToAnalysis(error) {
    //see chrome://network-errors/ for more information
    const errorMessageToAnalysis = {
      'NET::ERR_NAME_NOT_RESOLVED': this.LinkAnalysis.DNS_ERROR,
      'NET::ERR_SSL': this.LinkAnalysis.CERT_ERROR,
      'NET::ERR_BAD_SSL': this.LinkAnalysis.CERT_ERROR,
      'NET::ERR_CERT': this.LinkAnalysis.CERT_ERROR,
      'NET::ERR_TLS13': this.LinkAnalysis.CERT_ERROR,
      'NET::ERR_CONNECTION': this.LinkAnalysis.NETWORK_ERROR,
    };
    return errorMessageToAnalysis[
      Object.keys(errorMessageToAnalysis).find((message) => error.message.toUpperCase().includes(message))
    ];
  }

  async visit(link) {
    const page = await this.browser.newPage();
    return page.goto(link);
  }
}

module.exports = LinkAnalyzerService;
