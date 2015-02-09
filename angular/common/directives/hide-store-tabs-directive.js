(function (window, angular) {
  "use strict";

  angular
  .module('module.directives')
  .directive('hideStoreTabs', hideStoreTabs)
  .directive('showStoreTabs', showStoreTabs);

  function hideStoreTabs($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideStoreTabs.push(true);
        $log.log('hideStoreTabs in: ' + $rootScope.hideStoreTabs);
        $scope.$on('$destroy', function() {
          $rootScope.hideStoreTabs.pop();
          $log.log('hideStoreTabs out: ' + $rootScope.hideStoreTabs);
        });
      }
    };
  }
  function showStoreTabs($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideStoreTabs.push(false);
        $log.log('showStoreTabs in: ' + $rootScope.hideStoreTabs);
        $scope.$on('$destroy', function() {
          $rootScope.hideStoreTabs.pop();
          $log.log('showStoreTabs out: ' + $rootScope.hideStoreTabs);
        });
      }
    };
  }
})(window, window.angular);