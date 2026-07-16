/**
 * PulseCare AI – Email Provider Interface
 */

class EmailProviderInterface {
  /**
   * Sends an email.
   * @param {object} options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML body
   * @param {Array} [options.attachments] - Optional attachments
   * @param {string|Array} [options.cc] - Optional CC
   * @param {string|Array} [options.bcc] - Optional BCC
   * @returns {Promise<any>}
   */
  async send(options) {
    throw new Error('EmailProviderInterface.send() not implemented.');
  }
}

module.exports = EmailProviderInterface;
