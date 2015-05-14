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

    var options = { per_page: 100 };
    var processPage = function(error, list, meta) {
      if (error) {
        cb(error);
      }
      else {
        sails.log.debug("Adding page: " + meta.page);
        for (i in list) {
          var item = list[i];
          Recurring.create(Recurring.convertFromJsonObj(item), function(error, created) {
            sails.log.debug("Adding item: " + i);
            if (error) {
              sails.log.debug("Error: " + error);
              return cb(error);
            }
          });
        }

        options.page = meta.page + 1;
        if (meta.page < meta.pages) {
          freshbooksApi.recurring.list(options, processPage);
        }
        else {
          cb(error);
        }
      }
    }

    freshbooksApi.recurring.list(options, processPage);
  },

  convertFromJsonObj: function(jsonObj) {
    jsonObj.recurring_id = parseInt(jsonObj.recurring_id);
    // jsonObj.frequency
    jsonObj.occurrences = parseInt(jsonObj.occurrences);
    jsonObj.stopped = (jsonObj.stopped == '1');
    jsonObj.staff_id = parseInt(jsonObj.staff_id);
    jsonObj.prorate_days = parseInt(jsonObj.prorate_days);
    // jsonObj.currency_code
    // jsonObj.autobill
    jsonObj.client_id = parseInt(jsonObj.client_id);
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
    jsonObj.po_number = parseInt(jsonObj.po_number);
    delete jsonObj.status;
    jsonObj.amount = parseFloat(jsonObj.amount);
    jsonObj.date = new Date(jsonObj.date);
    jsonObj.updated = new Date(jsonObj.updated);
    // jsonObj.notes
    // jsonObj.terms
    jsonObj.discount = parseFloat(jsonObj.discount);
    // jsonObj.return_uri
    jsonObj.send_snail_mail = (jsonObj.send_snail_mail == '1');
    jsonObj.send_email = (jsonObj.send_email == '1');
    // jsonObj.folder
    jsonObj.contacts = JSON.stringify(jsonObj.contact);
    jsonObj.lines = JSON.stringify(jsonObj.lines);

    return jsonObj;
  }
};
