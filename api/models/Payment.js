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

    var options = { per_page: 100 };
    var processPage = function(error, list, meta) {
      if (error) {
        cb(error);
      }
      else {
        sails.log.debug("Adding page: " + meta.page);
        sails.log.debug (meta);
        for(i in list) {
          list[i] = Payment.convertFromJsonObj(list[i]);
        }

        Payment.create(list, function(error, created) {
          if (error) {
            sails.log.debug("Error: " + error);
            return cb(error);
          }
          else {
            meta.page = parseInt(meta.page);
            meta.pages = parseInt(meta.pages);

            if (meta.page < meta.pages) {
              options.page = meta.page + 1;
              sails.log.debug("Calling next page:", options.page);
              freshbooksApi.payment.list(options, processPage);
            }
            else {
              return cb(error);
            }
          }
        });

      }
    }

    freshbooksApi.payment.list(options, processPage);
  },

  convertFromJsonObj: function(jsonObj) {
    jsonObj.payment_id = parseInt(jsonObj.payment_id);
    jsonObj.invoice_id = parseInt(jsonObj.invoice_id);
    jsonObj.date = new Date(jsonObj.date);
    // jsonObj.type
    // jsonObj.notes
    jsonObj.client_id = parseInt(jsonObj.client_id);
    jsonObj.amount = parseFloat(jsonObj.amount);
    jsonObj.updated = new Date(jsonObj.updated);
    // jsonObj.currency_code
    jsonObj.from_credit = parseFloat(jsonObj.from_credit);

    return jsonObj;
  }
};
