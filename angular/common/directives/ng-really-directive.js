(function (window, angular) {
  "use strict";

  angular
  .module('module.directives')
  .directive('ngReallyClick', ngReallyClick);

  function ngReallyClick($rootScope, $log, $ionicPopup, $timeout) {
    var confirm = confirm;
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        element.bind('click', function() {
          var message = attrs.ngReallyMessage;
          confirm(message).then(function(result) {
            if(result){
              $scope.$applyAsync(attrs.ngReallyClick);
            }
          }, function(e){})
        });
        $scope.$on('$destroy', function() {
          element.off('click');
        });
      }
    }

    function confirm(message){
      return $ionicPopup.show({
        title: message,
        subTitle: '',
        buttons:[
          {
            text:'取消',
            onTap:function(e){
              return false;
            }
          },
          {
            text:'确定',
            onTap:function(e){
              return true;
            }
          }
        ]
      });
    }
  }
})(window, window.angular);