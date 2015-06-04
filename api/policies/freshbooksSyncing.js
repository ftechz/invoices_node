/**
 * freshbooksSyncing
 *
 * @module      :: Policy
 * @description :: Policy to disable access to pages while database is being synced`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (!freshbooks.syncing) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('Currently syncing with Freshbooks');
};
