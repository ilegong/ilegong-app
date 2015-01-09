(function (window, angular) {
  "use strict";

  angular
  .module('app.directives', [])
  .directive('hideTabs', hideTabs)
  .directive('showTabs', showTabs);

  function hideTabs($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideTabs = true;
        $scope.$on('$destroy', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  }
  function showTabs($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        // $log.log("on enter, change from " +  $rootScope.hideTabs);
        // $rootScope.hideTabs = false;
        // $log.log(" to " + $rootScope.hideTabs);
        // $scope.$on('$destroy', function() {
        //   // $log.log("on destroy, change from " + $rootScope.hideTabs);
        //   // $rootScope.hideTabs = false;
        //   // $log.log(" to " + $rootScope.hideTabs);
        // });
      }
    };
  }
})(window, window.angular);