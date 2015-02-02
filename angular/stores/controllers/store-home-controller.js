(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreHomeCtrl', StoreHomeCtrl)

  /* @ngInject */
  function StoreHomeCtrl($rootScope, $scope, $stateParams, $state, $ionicHistory, $log,Stores){
    var vm = this;
    vm.goBack = goBack;
    activate();

    function activate(){
      vm.storeId = $stateParams.storeId;
    }

    function goBack(){
      if($rootScope.hideTabs.length > 1 && ($rootScope.hideTabs[$rootScope.hideTabs.length - 1] == false)){
        $rootScope.hideTabs.pop();
      }
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);