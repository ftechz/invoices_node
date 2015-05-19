var FreshbooksLib = require('freshbooksjs');
var async = require('async');

var MAX_LIST_LEN = 100;

module.exports = {
    getInstance: function() {
       var url = sails.config.freshbooks.apiUrl;
       var token = sails.config.freshbooks.apiToken;

       return FreshbooksLib(url, token);
    },

    /**
     * func(error, item):error
     * cb(error)
     */
    eachListItem: function(service, func, cb) {
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
    }
}
