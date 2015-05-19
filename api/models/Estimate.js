/**
* Estimates.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    estimate_id: 'integer',
    number: 'integer',
    staff_id: 'integer',
    client_id: 'integer',
    contacts: 'text',
    organization: 'string',
    first_name: 'string',
    last_name: 'string',
    p_street1: 'string',
    p_street2: 'string',
    p_city: 'string',
    p_state: 'string',
    p_country: 'string',
    p_code: 'string',
    po_number: 'integer',
    status: 'string',
    amount: 'float',
    date: 'datetime',
    notes: 'text',
    terms: 'text',
    discount: 'float',
    language: 'string',
    currency_code: 'string',
    vat_name: 'string',
    vat_number: 'string',
    folder: 'string',
    lines: 'text',
    links: 'text'
  },

  syncWithFreshbooks: function(cb) {
    freshbooksApi = new freshbooks.getInstance();

    freshbooks.eachListItem(freshbooksApi.estimate,
      function(error, item, cb) {
        item = Estimate.convertFromJsonObj(item);

        Estimate.create(item, function(error, created) {
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
        sails.log.debug("Added Estimates");
        // No problem
      }
    );
  },

  convertFromJsonObj: function(jsonObj) {
    // jsonObj.estimate_id
    // jsonObj.number
    // jsonObj.staff_id
    // jsonObj.client_id
    jsonObj.contacts = JSON.stringify(jsonObj.contacts);
    // jsonObj.organization
    // jsonObj.first_name
    // jsonObj.last_name
    // jsonObj.p_street1
    // jsonObj.p_street2
    // jsonObj.p_city
    // jsonObj.p_state
    // jsonObj.p_country
    // jsonObj.p_code
    // jsonObj.po_number
    // jsonObj.status
    // jsonObj.amount
    // jsonObj.date
    // jsonObj.notes
    // jsonObj.terms
    // jsonObj.discount
    // jsonObj.language
    // jsonObj.currency_code
    // jsonObj.vat_name
    // jsonObj.vat_number
    // jsonObj.folder
    delete jsonObj.url;
    jsonObj.lines = JSON.stringify(jsonObj.lines);
    delete jsonObj.auth_url;
    jsonObj.links = JSON.stringify(jsonObj.links);

    return jsonObj;
  }
};
