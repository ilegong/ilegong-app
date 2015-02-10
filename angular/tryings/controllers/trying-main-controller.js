(function (window, angular) {
  "use strict";

  angular.module('module.tryings')
  .controller('TryingsCtrl', TryingsCtrl)

  /* @ngInject */
  function TryingsCtrl($rootScope, $scope, Tryings){
    var vm = this;
    vm.doRefresh = doRefresh;
    activate();

    function activate(){
      vm.tryings = $rootScope.tryings;
    }

    function doRefresh(){
      $rootScope.reloadTryings().then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      }, function(e){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      });
    }
  }
})(window, window.angular);