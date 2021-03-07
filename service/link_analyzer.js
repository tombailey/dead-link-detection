class LinkAnalyzerService {
  static CONTENT_MISSING_HINTS = [
    'not found',
    'page doesn’t exist',
    `page doesn't exist`,
    'page does not exist',
    'page you’re looking for isn’t here',
    `page you're looking for isn't here`,
    'this account doesn’t exist',
    `this account doesn't exist`,
    `we can't find that page`,
    'we can’t find that page',
    'that content is unavailable',
    'the page is broken',
  ];

  constructor(
    browser,
    LinkAnalysis = require('../model/link_analysis')
  ) {
    this.browser = browser;
    this.LinkAnalysis = LinkAnalysis;
  }

  async analyze(link) {
    try {
      const {
        page,
        response,
      } = await this.visit(link);
      if (response == null) {
        //about:blank treated as an error
        return this.LinkAnalysis.NETWORK_ERROR;
      } else if (!response.ok()) {
        return (response.status() === 404 || response.status() === 410) ? this.LinkAnalysis.CONTENT_MISSING : this.LinkAnalysis.NETWORK_ERROR;
      } else if (await this.htmlSuggestsContentIsMissing(page)) {
        return this.LinkAnalysis.CONTENT_MISSING;
      } else {
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

  async htmlSuggestsContentIsMissing(page) {
    const title = (await page.title()).toLowerCase();
    if (LinkAnalyzerService.CONTENT_MISSING_HINTS.some(contentMissingHint => title.includes(contentMissingHint))) {
      return true;
    } else {
      const body = await page.$eval('body',(body) => body.innerText.toLowerCase());
      return LinkAnalyzerService.CONTENT_MISSING_HINTS.some(contentMissingHint => body.includes(contentMissingHint));
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
    return  page.goto(link, {
      waitUntil: 'networkidle2',
    }).then((response) => {
      return {page, response};
    });
  }
}

module.exports = LinkAnalyzerService;
