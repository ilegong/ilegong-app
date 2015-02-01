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
        $rootScope.hideTabs.push(true);
        $scope.$on('$destroy', function() {
          $rootScope.hideTabs.pop();
        });
      }
    };
  }
  function showTabs($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideTabs.push(false);
        $scope.$on('$destroy', function() {
          $rootScope.hideTabs.pop();
        });
      }
    };
  }
})(window, window.angular);