/**
* Categories.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    category_id: 'integer',
    name: 'string',
    parent_id: {
      type: 'integer',
      required: false
    }
  },

  syncWithFreshbooks: function(cb) {
    freshbooksApi = new freshbooks.getInstance();

    freshbooks.eachListItem(freshbooksApi.category,
      function(error, item, cb) {
        item = Category.convertFromJsonObj(item);

        Category.create(item, function(error, created) {
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
        sails.log.debug("Added Categories");
        // No problem
      }
    );
  },

  convertFromJsonObj: function(jsonObj) {
    //jsonObj.category_id = parseInt(jsonObj.category_id);
    // jsonObj.name
    if (jsonObj.parent_id == '') {
      delete jsonObj.parent_id;
    }
    return jsonObj;
  }
};
