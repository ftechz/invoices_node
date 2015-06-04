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

  /**
   * cb(error)
   */
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

        freshbooks.eachListItem(freshbooksApi.category,
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
              sails.log.debug("Error while adding categories");
            }
            else {
              sails.log.debug("Added categories");
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
    //jsonObj.category_id = parseInt(jsonObj.category_id);
    // jsonObj.name
    if (jsonObj.parent_id == '') {
      delete jsonObj.parent_id;
    }
    return jsonObj;
  }
};
