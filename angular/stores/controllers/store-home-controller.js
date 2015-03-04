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
      $rootScope.storeId = $stateParams.id;
      $rootScope.storeName = $stateParams.name;
      Stores.getStore($rootScope.storeId).then(function(store){
        vm.store = store.content.info;
        vm.products = store.content.products;
      });
    }

    function goBack(){
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);