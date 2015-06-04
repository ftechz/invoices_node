/**
* freshbooks.js
*
* @description :: Service to allow global access to the freshbooks API
* @docs        :: http://sailsjs.org/#!documentation/services
*/

var FreshbooksLib = require('freshbooksjs');

var MAX_LIST_LEN = 100; // The maximum allowed by freshbooks

function Freshbooks() {
  this._apiInstance = null;
  this.syncing = false;
}

Freshbooks.prototype.getInstance = function() {
  if (this._apiInstance == null) {
    var url = sails.config.freshbooks.apiUrl;
    var token = sails.config.freshbooks.apiToken;
    this._apiInstance = new FreshbooksLib(url, token);
  }

  return this._apiInstance;
};

/**
 * Run the synchronisation functions for every freshbook service model
 */
Freshbooks.prototype.startSync = function() {
  var self = this;
  self.syncing = true;

  var freshbookDatabases = [ Category, Expense, Estimate, Expense, Invoice, Payment, Recurring ];

  sails.log.debug('Starting freshbooks sync');
  async.eachSeries(freshbookDatabases,
    function(item, callback) {
      item.syncWithFreshbooks(callback);
    },
    function(err) {
      if (err) {
        sails.log.debug('Error in syncing: ' + err);
      }
      else {
        sails.log.debug('Successfully synced with freshbooks');
      }
      // End of sync
      self.syncing = false;
    }
  );
}

/**
 * Execute 'func' for every item in the freshbook service
 *
 * service: The freshbook service
 * func(error, item):error
 * cb(error)
 */
Freshbooks.prototype.eachListItem = function(service, func, cb) {
  var items = [];
  var options = {
    per_page: MAX_LIST_LEN
  };

  var eachListFunc = func;
  var completionCb = cb;

  var processPage = function(error, list, meta) {
    if (error) {
      // Error getting page
      return completionCb(error);
    }
    else {
      async.eachSeries(list,
        function(item, cb) {
          eachListFunc(error, item, function(error) { cb(error); } );
        },
        function(error) {
          if (error) {
            return completionCb(error);
          }
          else {
            sails.log("Processed page: " + meta.page);
            // Completed page without issue, get next page
            meta.page = parseInt(meta.page);
            meta.pages = parseInt(meta.pages);

            if (meta.page < meta.pages) {
              options.page = meta.page + 1;
              service.list(options, processPage);
            }
            else {
              // No more pages
              return completionCb();
            }
          }
        }
      );
    }
  }

  service.list(options, processPage);
};

Freshbooks.prototype.callbackReceived = function(params) {
  switch(params.name) {
    case 'callback.verify':
      // Send verifier
      params.verifier;
      break;
    case 'category.create':
    case 'category.delete':
    case 'category.update':
      break;
    // case 'client.create':
    // case 'client.delete':
    // case 'client.update':
    //   break;
    case 'estimate.create':
    case 'estimate.delete':
    case 'estimate.sendByEmail':
    case 'estimate.update':
      break;
    case 'expense.create':
    case 'expense.delete':
    case 'expense.update':
      break;
    case 'invoice.create':
    case 'invoice.delete':
    case 'invoice.dispute':
    case 'invoice.pastdue.1':
    case 'invoice.pastdue.2':
    case 'invoice.pastdue.3':
    case 'invoice.sendByEmail':
    case 'invoice.sendBySnailMail':
    case 'invoice.update':
      break;
    // case 'item.create':
    // case 'item.delete':
    // case 'item.update':
    //   break;
    case 'payment.create':
    case 'payment.delete':
    case 'payment.update':
      break;
    // case 'project.create':
    // case 'project.delete':
    // case 'project.update':
    //   break;
    case 'recurring.create':
    case 'recurring.delete':
    case 'recurring.update':
      break;
    // case 'staff.create':
    // case 'staff.delete':
    // case 'staff.update':
    //   break;
    // case 'task.create':
    // case 'task.delete':
    // case 'task.update':
    //   break;
    // case 'time_entry.create':
    // case 'time_entry.delete':
    // case 'time_entry.update':
    //   break;
    default:
      return false;
      break;
  }

  return true;
}

module.exports = new Freshbooks();
