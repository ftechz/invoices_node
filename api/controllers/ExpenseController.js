/**
 * ExpensesController
 *
 * @description :: Server-side logic for managing Expenses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	sync: function(req, res) {
		Expense.syncWithFreshbooks(function(error) {

		})
	}
};
