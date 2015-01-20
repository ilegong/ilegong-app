(function (window, angular) {
  "use strict";

  angular
  .module('module.directives')
  .directive('ngReallyClick', ngReallyClick);

  function ngReallyClick($rootScope, $log) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        element.bind('click', function() {
          var message = attrs.ngReallyMessage;
          if (message && confirm(message)) {
            $scope.$apply(attrs.ngReallyClick);
          }
        });
        $scope.$on('$destroy', function() {
          element.off('click');
        });
      }
    }
  }
})(window, window.angular);