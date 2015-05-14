var FreshbooksLib = require('freshbooksjs');

module.exports = {
    getInstance: function() {
       var url = sails.config.freshbooks.apiUrl;
       var token = sails.config.freshbooks.apiToken;

       return FreshbooksLib(url, token);
    }
}
