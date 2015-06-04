function formatInvoiceObj(obj) {
  if (obj.lines) {
    var lines = JSON.parse(obj.lines)['line'];
    var descArray = _.map(lines, function(line) {
      return line['description'];
    });
    obj.description = descArray.join('\n\n');

    if (obj.recurring_id != '') {
      obj.classes = 'recurring';
    }
  }

  return obj;
}

angular.module('material-table')
  .controller('invoice-table', ['$filter', '$sails', '$scope', function($filter, $sails, $scope){
    var self = this;
    self.url = '/Invoice';
    self.invoices = [];

    self.month = $scope.month;

    (function () {
      var start = self.month;
      var end = new Date(self.month);
      end.setMonth(end.getMonth() + 1);

      var filter = '{"date":{' +
                      '">=":"' + start.toISOString() + '",' +
                      '"<":"'+ end.toISOString() +'"}}';
      $sails.get(self.url + "?where=" + filter + "&sort=date DESC")
        .then(function(resp) {
            self.invoices = formatInvoiceObj(resp.data);
            $scope.$emit('invoice_table:loaded')
        }, function(resp) {
          console.log('Error getting data for month ' + self.month + ': ' + resp);
        });

      // Watching for updates
      $sails.on("Invoice", function (message) {
        if (message.verb === "created") {
          self.invoices.push(message.data);
        }
      });
    }());

    self.headers = [
      { name: 'Job', field: 'po_number' },
      { name: 'Client', field: 'organization' },
      { name: 'Description', field: 'description' },
      { name: 'Amount', field: 'amount', type: 'currency' },
      { name: 'Outstanding', field: 'amount_outstanding' },
      { name: 'Date', field: 'date', filter: $filter('date') },
      { name: 'Payments', field: 'payments', type: 'currency' },
      { name: 'Expenses', field: 'expenses', type: 'currency' },
      { name: 'Revenue', field: 'revenue', type: 'currency' }
    ];

    self.custom = {
      description:'grey',
      amount: 'currency',
      amount_outstanding: 'currency',
      payments: 'currency',
      expenses: 'currency',
      revenue: 'currency'
    };

    self.sortable = ['date', 'po_number', 'organization', 'amount', 'outstanding',  'payments', 'expenses', 'revenue'];
    self.count = 100;

  }]);
