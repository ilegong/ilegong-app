(function (window, angular) {
  "use strict";

  angular
  .module('module.directives')
  .directive('hideTabs', hideTabs)
  .directive('showTabs', showTabs);

  function hideTabs($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideTabs = $rootScope.hideTabs || [];
        $rootScope.hideTabs.push(true);
        // $log.log('hideTabs in: ' + $rootScope.hideTabs);
        $scope.$on('$destroy', function() {
          $rootScope.hideTabs.pop();
          // $log.log('hideTabs out: ' + $rootScope.hideTabs);
        });
      }
    };
  }
  function showTabs($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideTabs = $rootScope.hideTabs || [];
        $rootScope.hideTabs.push(false);
        // $log.log('showTabs in: ' + $rootScope.hideTabs);
        $scope.$on('$destroy', function() {
          $rootScope.hideTabs.pop();
          // $log.log('showTabs out: ' + $rootScope.hideTabs);
        });
      }
    };
  }
})(window, window.angular);