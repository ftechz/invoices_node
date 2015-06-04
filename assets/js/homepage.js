(function() {
  var app = angular
      .module('homepage', ['ngMaterial', 'material-table', 'ngSails', 'sidebar', 'infinite-scroll'])

      // Configure Angular Material theme
      .config(function($mdThemingProvider, $mdIconProvider){
        $mdIconProvider
            .icon("menu"       , "./svg/menu.svg"        , 24);
        $mdThemingProvider.theme('default')
            .primaryPalette('grey', {
              'default': '300'
            })
            .accentPalette('orange');
      })

      // Configure the URL of the sails socket
      .config(['$sailsProvider', function ($sailsProvider) {
        $sailsProvider.url = '/';
      }]);

  angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);

  app.controller('AppCtrl', ['$scope', '$q', '$sails', function($scope, $q, $sails) {
      var self = this;
      self.url = '/Invoice';

      self.months = []; //[new Date(2015, 0), new Date(2015, 1), new Date(2015, 2)];

      self.lastDate = null;
      self.firstDate = null;
      self.furthestDate = null;
      self.reachedEnd = false;

      (function () {
        var filter = '?limit=1&where={"date":{"!":0}}&sort=date';

        // Get the earliest and latest dates
        $q.all([ $sails.get(self.url + filter + ' ASC'),
            $sails.get(self.url + filter + ' DESC') ])
          .then(function(resp) {
            if (resp.length == 0) {
              // Nothing in the database...?
              self.reachedEnd = true;
            }
            else {
              self.lastDate = new Date(resp[1].data[0].date);
              self.firstDate = new Date(resp[0].data[0].date);

              self.furthestDate = d = new Date(self.lastDate.getFullYear(), self.lastDate.getMonth());

              // Push the latest month
              self.months.push(new Date(d));
            }

          }, function(reason) {
            console.log('Error getting data: ' + resp);
            self.reachedEnd = true;
          });

        // Watching for updates
        $sails.on("Invoice", function (message) {
          if (message.verb === "created") {
            self.invoices.push(message.data);
          }
        });
      }());

      self.addMonth = function() {
        if (self.furthestDate == null) {
          return false;
        }

        var d = self.furthestDate;
        if (d.getFullYear() == self.firstDate.getFullYear() &&
            d.getMonth() == self.firstDate.getMonth()) {
          self.reachedEnd = true;
          return false;
        }

        d.setMonth(d.getMonth() - 1);
        self.months.push(new Date(d));
        return true;
      }
    }]);
})();
