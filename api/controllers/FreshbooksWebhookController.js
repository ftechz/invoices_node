/**
 * Freshbooks_webhookController
 *
 * @description :: Server-side logic for managing freshbooks_webhooks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  'callback' : function(req, res) {
    var callbackParams = {
      name: req.param('name'), // == 'estimate.create'
      object_id: req.param('object_id'),
      system: req.param('system'), // == 'https://2ndsite.freshbooks.com/'
      user_id: req.param('user_id'),
			verifier: req.param('verifier')
    };

		if (freshbooks.callbackReceived(callbackParams)) {
    	return res.ok();
		}
		else {
			return res.badRequest();
		}
  },
};
