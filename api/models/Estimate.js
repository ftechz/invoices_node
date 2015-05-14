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

    var options = { per_page: 100 };
    var processPage = function(error, list, meta) {
      if (error) {
        cb(error);
      }
      else {
        sails.log.debug("Adding page: " + meta.page);
        sails.log.debug (meta);
        for(i in list) {
          list[i] = Estimate.convertFromJsonObj(list[i]);
        }

        Estimate.create(list, function(error, created) {
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
              freshbooksApi.estimate.list(options, processPage);
            }
            else {
              return cb(error);
            }
          }
        });

      }
    }

    freshbooksApi.estimate.list(options, processPage);
  },

  convertFromJsonObj: function(jsonObj) {
    jsonObj.estimate_id = parseInt(jsonObj.estimate_id);
    jsonObj.number = parseInt(jsonObj.number);
    jsonObj.staff_id = parseInt(jsonObj.staff_id);
    jsonObj.client_id = parseInt(jsonObj.client_id);
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
    jsonObj.po_number = parseInt(jsonObj.po_number);
    // jsonObj.status
    jsonObj.amount = parseFloat(jsonObj.amount);
    jsonObj.date = new Date(jsonObj.date);
    // jsonObj.notes
    // jsonObj.terms
    jsonObj.discount = parseFloat(jsonObj.discount);
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
