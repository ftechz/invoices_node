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
    freshbooksApi = new freshbooks.getInstance();

    var options = { per_page: 100 };
    var processPage = function(error, list, meta) {
      if (error) {
        cb(error);
      }
      else {
        sails.log.debug("Adding page: " + meta.page);
        sails.log.debug (meta);
        for (i in list) {
          var item = list[i];
          list[i] = Invoice.convertFromJsonObj(item);
        }

        Invoice.create(list, function(error, created) {
          if (error) {
            sails.log.debug("Error: " + error);
            return cb(error);
          }
          else {
            meta.page = parseInt(meta.page);
            meta.pages = parseInt(meta.pages);

            options.page = meta.page + 1;
            sails.log.debug("Calling next page:", options.page);
            if (meta.page < meta.pages) {
              freshbooksApi.invoice.list(options, processPage);
            }
            else {
              return cb(error);
            }
          }
        });

      }
    }

    freshbooksApi.invoice.list(options, processPage);
  },

  convertFromJsonObj: function(jsonObj) {
    jsonObj.invoice_id = parseInt(jsonObj.invoice_id);
    if (jsonObj.estimate_id == '') {
      delete jsonObj.estimate_id;
    }
    else {
      jsonObj.estimate_id = parseInt(jsonObj.estimate_id);
    }
    jsonObj.number = parseInt(jsonObj.number);
    jsonObj.client_id = parseInt(jsonObj.client_id);
    jsonObj.contacts = JSON.stringify(jsonObj.contacts);
    //jsonObj.recurring_id
    //jsonObj.organization
    //jsonObj.first_name
    //jsonObj.last_name
    //jsonObj.p_street1
    //jsonObj.p_street2
    //jsonObj.p_city
    //jsonObj.p_state
    //jsonObj.p_country
    //jsonObj.p_code
    if (jsonObj.po_number == '') {
      delete jsonObj.po_number;
    }
    else {
      jsonObj.po_number = parseInt(jsonObj.po_number);
    }
    //jsonObj.status
    jsonObj.amount = parseFloat(jsonObj.amount);
    jsonObj.amount_outstanding = parseFloat(jsonObj.amount_outstanding);
    jsonObj.paid = parseFloat(jsonObj.paid);
    jsonObj.date = new Date(jsonObj.date);
    //jsonObj.notes
    //jsonObj.terms
    jsonObj.discount = parseFloat(jsonObj.discount);
    //jsonObj.return_uri
    jsonObj.updated = new Date(jsonObj.updated);
    //jsonObj.currency_code
    //jsonObj.language
    //jsonObj.vat_name
    //jsonObj.vat_number
    //jsonObj.folder
    jsonObj.staff_id = parseInt(jsonObj.staff_id);
    jsonObj.lines = JSON.stringify(jsonObj.lines);
    delete jsonObj.url;
    delete jsonObj.auth_url;
    jsonObj.links = JSON.stringify(jsonObj.links);
    //jsonObj.gateways

    return jsonObj;
  }
};
