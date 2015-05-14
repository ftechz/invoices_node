/**
* Expenses.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    expense_id: 'integer',
    category_id: 'integer',
    project_id: 'integer',
    client_id: 'integer',
    staff_id: 'integer',
    amount: 'integer',
    date: 'datetime',
    notes: 'text',
    status: 'boolean',
    vendor: 'string',
    tax1_name: {
        type: 'string',
        required: false
    },
    tax1_percent: 'float',
    tax1_amount: 'float',
    tax2_name: 'string',
    tax2_percent: 'float',
    tax2_amount: 'float',
    compound_tax: 'float',
    folder: 'string',
    has_receipt: 'boolean',
    updated: 'datetime',
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
          list[i] = Expense.convertFromJsonObj(item);
        }

        Expense.create(list, function(error, created) {
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
              freshbooksApi.expense.list(options, processPage);
            }
            else {
              return cb(error);
            }
          }
        });

      }
    }

    freshbooksApi.expense.list(options, processPage);
  },

  convertFromJsonObj: function(jsonObj) {
    jsonObj.expense_id = parseInt(jsonObj.expense_id);
    jsonObj.category_id = parseInt(jsonObj.category_id);
    jsonObj.project_id = parseInt(jsonObj.project_id);
    jsonObj.client_id = parseInt(jsonObj.client_id);
    jsonObj.staff_id = parseInt(jsonObj.staff_id);
    jsonObj.amount = parseInt(jsonObj.amount);
    jsonObj.date = new Date(jsonObj.date);
    // jsonObj.notes
    jsonObj.status = (jsonObj.status == '1');
    // jsonObj.vendor

    if (jsonObj.tax1_name == '' || jsonObj.tax1_percent == '' || jsonObj.tax1_amount == '') {
      delete jsonObj.tax1_name;
      delete jsonObj.tax1_percent;
      delete jsonObj.tax1_amount;
    }
    else {
      // jsonObj.tax1_name
      jsonObj.tax1_percent = parseFloat(jsonObj.tax1_percent);
      jsonObj.tax1_amount = parseFloat(jsonObj.tax1_amount);
    }

    if (jsonObj.tax2_name == '' || jsonObj.tax2_percent == '' || jsonObj.tax2_amount == '') {
      delete jsonObj.tax2_name;
      delete jsonObj.tax2_percent;
      delete jsonObj.tax2_amount;
    }
    else {
      // jsonObj.tax2_name
      jsonObj.tax2_percent = parseFloat(jsonObj.tax2_percent);
      jsonObj.tax2_amount = parseFloat(jsonObj.tax2_amount);
    }
    jsonObj.compound_tax = parseFloat(jsonObj.compound_tax);
    // jsonObj.folder
    jsonObj.has_receipt = (jsonObj.has_receipt == '1');
    jsonObj.updated = new Date(jsonObj.updated);
    return jsonObj;
  }

};
