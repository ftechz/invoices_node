/**
* Payments.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
      payment_id: 'integer',
      invoice_id: 'integer',
      date: 'datetime',
      type: 'string',
      notes: 'text',
      client_id: 'integer',
      amount: 'float',
      updated: 'datetime',
      currency_code: 'string',
      from_credit: 'float'
  },

  syncWithFreshbooks: function(cb) {
    var self = this;

    async.series([
      // Delete all entires
      function(cb) {
        self.destroy({}, function(error){ cb(error); });
      },
      // Fetch entries from Freshbooks
      function(cb) {
        freshbooksApi = freshbooks.getInstance();

        freshbooks.eachListItem(freshbooksApi.payment,
          function(error, item, cb) {
            item = self.convertFromJsonObj(item);

            self.create(item, function(error, created) {
              if (error) {
                sails.log.debug("Error: " + error);
                return cb(error);
              }
              else {
                // No problem
                return cb();
              }
            });
          },
          function(error) {
            if (error) {
              sails.log.debug("Error while adding payments");
            }
            else {
              sails.log.debug("Added payments");
            }
            return cb(error);
          }
        );
      }
    ],
    function(error) {
      return cb(error);
    });
  },

  convertFromJsonObj: function(jsonObj) {
    // jsonObj.payment_id
    // jsonObj.invoice_id
    // jsonObj.date
    // jsonObj.type
    // jsonObj.notes
    // jsonObj.client_id
    // jsonObj.amount
    // jsonObj.updated
    // jsonObj.currency_code
    // jsonObj.from_credit

    return jsonObj;
  }
};
