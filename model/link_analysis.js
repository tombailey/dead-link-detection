const statuses = {
  WORKING: 'working',
  CONTENT_MISSING: 'content_missing',
  DNS_ERROR: 'dns_error',
  CERT_ERROR: 'certificate_error',
  NETWORK_ERROR: 'network_error',
};

const WORKING = {
  status: statuses.WORKING,
  consideredBroken: false,
};

const CONTENT_MISSING = {
  status: statuses.CONTENT_MISSING,
  isLikelyTemporaryIssue: false,
  consideredBroken: true,
};

const DNS_ERROR = {
  status: statuses.DNS_ERROR,
  isLikelyTemporaryIssue: true,
  consideredBroken: true,
};

const CERT_ERROR = {
  status: statuses.CERT_ERROR,
  isLikelyTemporaryIssue: true,
  consideredBroken: true,
}

const NETWORK_ERROR = {
  status: statuses.NETWORK_ERROR,
  isLikelyTemporaryIssue: true,
  consideredBroken: true,
}

module.exports = {
  statuses,
  WORKING,
  CONTENT_MISSING,
  DNS_ERROR,
  CERT_ERROR,
  NETWORK_ERROR,
};