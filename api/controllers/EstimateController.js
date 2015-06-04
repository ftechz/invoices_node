/**
 * EstimatesController
 *
 * @description :: Server-side logic for managing Estimates
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	sync: function(req, res) {
		Estimate.syncWithFreshbooks(function(error) {
			
		})
	}
};
