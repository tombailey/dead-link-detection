const ControllerInterface = require('../interface');

class HealthController extends ControllerInterface {
  registerHandlers(expressApp) {
    expressApp.get('/health', this.handleCheckHealth.bind(this));
  }

  handleCheckHealth(_, response) {
    response.status(200).json({ status: 'pass' });
  }
}

module.exports = HealthController;