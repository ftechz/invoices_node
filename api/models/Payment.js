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
    freshbooksApi = new freshbooks.getInstance();

    freshbooks.eachListItem(freshbooksApi.payment,
      function(error, item, cb) {
        item = Payment.convertFromJsonObj(item);

        Payment.create(item, function(error, created) {
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
        sails.log.debug("Added Payments");
        // No problem
      }
    );
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
