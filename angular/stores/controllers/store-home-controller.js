(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreHomeCtrl', StoreHomeCtrl)

  /* @ngInject */
  function StoreHomeCtrl($rootScope, $scope, $stateParams, $state, $ionicHistory, $log,Stores){
    var vm = this;
    vm.goBack = goBack;
    vm.getItemHeight = getItemHeight;
    vm.loadData = loadData;
    activate();

    function activate(){
      $rootScope.storeId = $stateParams.id;
      $rootScope.storeName = $stateParams.name;

      var imageWidth = window.innerWidth / 2 - 15 - 2; // 15px padding, 2px border
      vm.imageHeight = Math.round(imageWidth * 3 / 4);
      var productNameHeight = 18;
      var priceHeight = 18;
      vm.itemHeight = Math.ceil(vm.imageHeight + productNameHeight + priceHeight + 22); // 10px padding + 10px divider + 2px border

      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }

    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Stores.getStore($rootScope.storeId).then(function(store){
        vm.store = store.content.info;
        vm.products = store.content.products;

        vm.loadStatus.succeeded();
      }, function(){
        vm.loadStatus.failed(e.status);
      });
    }

    function getItemHeight(){
      return vm.itemHeight + 'px';
    }

    function goBack(){
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);