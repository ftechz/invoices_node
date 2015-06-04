/**
* Invoices.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    invoice_id: 'integer',
    estimate_id: {
      type: 'integer',
      required: false
    },
    number: 'integer',
    client_id: 'integer',
    contacts: 'text',
    recurring_id: 'string',
    organization: 'string',
    first_name: 'string',
    last_name: 'string',
    p_street1: 'string',
    p_street2: 'string',
    p_city: 'string',
    p_state: 'string',
    p_country: 'string',
    p_code: 'string',
    po_number: {
      type: 'integer',
      required: false
    },
    status: {
      type: 'string',
    //   enum: ['sent']                  // TODO Add rest of the enums
    },
    amount: 'float',
    amount_outstanding: 'float',
    paid: 'float',
    date: 'datetime',
    notes: 'text',
    terms: 'text',
    discount: 'float',
    return_uri: 'string',
    updated: 'datetime',
    currency_code: 'string',
    language: 'string',
    vat_name: 'string',
    vat_number: 'string',
    folder: 'string',
    staff_id: 'integer',
    lines: 'text',
    links: 'text',
    gateways: 'string',
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

        freshbooks.eachListItem(freshbooksApi.invoice,
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
              sails.log.debug("Error while adding invoices");
            }
            else {
              sails.log.debug("Added invoices");
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
    // jsonObj.invoice_id
    if (jsonObj.estimate_id == '') {
      delete jsonObj.estimate_id;
    }
    // jsonObj.number
    // jsonObj.client_id
    jsonObj.contacts = JSON.stringify(jsonObj.contacts);
    // jsonObj.recurring_id
    // jsonObj.organization
    // jsonObj.first_name
    // jsonObj.last_name
    // jsonObj.p_street1
    // jsonObj.p_street2
    // jsonObj.p_city
    // jsonObj.p_state
    // jsonObj.p_country
    // jsonObj.p_code
    if (jsonObj.po_number == '') {
      delete jsonObj.po_number;
    }
    // jsonObj.status
    // jsonObj.amount
    // jsonObj.amount_outstanding
    // jsonObj.paid
    // jsonObj.date
    // jsonObj.notes
    // jsonObj.terms
    // jsonObj.discount
    // jsonObj.return_uri
    // jsonObj.updated
    // jsonObj.currency_code
    // jsonObj.language
    // jsonObj.vat_name
    // jsonObj.vat_number
    // jsonObj.folder
    // jsonObj.staff_id
    jsonObj.lines = JSON.stringify(jsonObj.lines);
    delete jsonObj.url;
    delete jsonObj.auth_url;
    jsonObj.links = JSON.stringify(jsonObj.links);
    // jsonObj.gateways

    return jsonObj;
  }
};
