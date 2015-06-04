var FreshbooksLib = require('freshbooksjs');

var MAX_LIST_LEN = 100;

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

module.exports = new Freshbooks();
