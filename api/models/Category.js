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
          list[i] = Category.convertFromJsonObj(item);
        }

        Category.create(list, function(error, created) {
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
              freshbooksApi.category.list(options, processPage);
            }
            else {
              return cb(error);
            }
          }
        });

      }
    }

    freshbooksApi.category.list(options, processPage);
  },

  convertFromJsonObj: function(jsonObj) {
    jsonObj.category_id = parseInt(jsonObj.category_id);
    // jsonObj.name
    if (jsonObj.parent_id) {
      delete jsonObj.parent_id;
    }
    else {
      jsonObj.parent_id = parseInt(jsonObj.parent_id);
    }
    return jsonObj;
  }
};
