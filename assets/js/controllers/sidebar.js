(function(){

  angular.module('sidebar')
       .controller('SidebarController', [
          '$mdSidenav',
          SidebarController
       ]);

  /**
   * Sidebar Controller
   * @param $scope
   * @param $mdSidenav
   * @constructor
   */
  function SidebarController($mdSidenav) {
    var self = this;

    self.open = false;
    self.selected     = null;
    self.toggleList   = toggleSidebar;

    // *********************************
    // Internal methods
    // *********************************

    function toggleSidebar() {
      //var pending = $mdBottomSheet.hide() || $q.when(true);

      // pending.then(function(){
        //$mdSidenav('left').toggle();
        self.open = !self.open;
      // });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function select ( menuId ) {
      // self.selected = angular.isNumber(menuId) ? $scope.users[user] : user;
      self.toggleList();
    }
  }

})();
