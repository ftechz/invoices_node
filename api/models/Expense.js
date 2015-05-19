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

    freshbooks.eachListItem(freshbooksApi.expense,
      function(error, item, cb) {
        item = Expense.convertFromJsonObj(item);

        Expense.create(item, function(error, created) {
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
        sails.log.debug("Added Expenses");
        // No problem
      }
    );
  },

  convertFromJsonObj: function(jsonObj) {
    // jsonObj.expense_id
    // jsonObj.category_id
    // jsonObj.project_id
    // jsonObj.client_id
    // jsonObj.staff_id
    // jsonObj.amount
    // jsonObj.date
    // jsonObj.notes
    jsonObj.status = (jsonObj.status == '1');
    // jsonObj.vendor

    if (jsonObj.tax1_name == '' || jsonObj.tax1_percent == '' || jsonObj.tax1_amount == '') {
      delete jsonObj.tax1_name;
      delete jsonObj.tax1_percent;
      delete jsonObj.tax1_amount;
    }

    if (jsonObj.tax2_name == '' || jsonObj.tax2_percent == '' || jsonObj.tax2_amount == '') {
      delete jsonObj.tax2_name;
      delete jsonObj.tax2_percent;
      delete jsonObj.tax2_amount;
    }
    // jsonObj.compound_tax
    // jsonObj.folder
    jsonObj.has_receipt = (jsonObj.has_receipt == '1');
    // jsonObj.updated
    return jsonObj;
  }

};
