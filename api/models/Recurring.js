/**
* Recurring.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    recurring_id: 'integer',
    frequency: 'string',
    occurrences: 'integer',
    stopped: 'boolean',
    staff_id: 'integer',
    prorate_days: 'integer',
    currency_code: 'string',
    autobill: 'string',
    client_id: 'integer',
    organization: 'string',
    first_name: 'string',
    last_name: 'string',
    p_street1: 'string',
    p_street2: 'string',
    p_city: 'string',
    p_state: 'string',
    p_country: 'string',
    p_code: 'string',
    vat_name: 'string',
    vat_number: 'string',
    language: 'string',
    po_number: 'integer',
    amount: 'float',
    date: 'datetime',
    updated: 'datetime',
    notes: 'text',
    terms: 'text',
    discount: 'float',
    return_uri: 'string',
    send_snail_mail: 'boolean',
    send_email: 'boolean',
    folder: 'string',
    contacts: 'text',
    lines: 'text'
  },

  syncWithFreshbooks: function(cb) {
    freshbooksApi = new freshbooks.getInstance();

    freshbooks.eachListItem(freshbooksApi.recurring,
      function(error, item, cb) {
        item = Recurring.convertFromJsonObj(item);

        Recurring.create(item, function(error, created) {
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
        sails.log.debug("Added Recurring");
        // No problem
      }
    );
  },

  convertFromJsonObj: function(jsonObj) {
    // jsonObj.recurring_id
    // jsonObj.frequency
    // jsonObj.occurrences
    jsonObj.stopped = (jsonObj.stopped == '1');
    // jsonObj.staff_id
    // jsonObj.prorate_days
    // jsonObj.currency_code
    // jsonObj.autobill
    // jsonObj.client_id
    // jsonObj.organization
    // jsonObj.first_name
    // jsonObj.last_name
    // jsonObj.p_street1
    // jsonObj.p_street2
    // jsonObj.p_city
    // jsonObj.p_state
    // jsonObj.p_country
    // jsonObj.p_code
    // jsonObj.vat_name
    // jsonObj.vat_number
    // jsonObj.language
    // jsonObj.po_number
    delete jsonObj.status;
    // jsonObj.amount
    // jsonObj.date
    // jsonObj.updated
    // jsonObj.notes
    // jsonObj.terms
    // jsonObj.discount
    // jsonObj.return_uri
    jsonObj.send_snail_mail = (jsonObj.send_snail_mail == '1');
    jsonObj.send_email = (jsonObj.send_email == '1');
    // jsonObj.folder
    jsonObj.contacts = JSON.stringify(jsonObj.contact);
    jsonObj.lines = JSON.stringify(jsonObj.lines);

    return jsonObj;
  }
};
