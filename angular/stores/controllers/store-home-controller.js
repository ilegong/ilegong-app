(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreHomeCtrl', StoreHomeCtrl)

  /* @ngInject */
  function StoreHomeCtrl($rootScope, $scope, $stateParams, $state, $ionicHistory, $log,Stores){
    var vm = this;
    vm.goBack = goBack;
    vm.getItemHeight = getItemHeight;
    vm.getItemWidth = getItemWidth;
    vm.loadData = loadData;
    activate();

    function activate(){
      $rootScope.storeId = $stateParams.id;
      $rootScope.storeName = $stateParams.name;

      var deviceWidth = window.innerWidth;
      vm.itemWidth = Math.round((window.innerWidth - 10) / 2);
      vm.imageWidth = vm.itemWidth - 10 - 2; // 2px border
      vm.imageHeight = Math.round(vm.imageWidth * 3 / 4);
      var productNameHeight = 20;
      var priceHeight = 20;
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
    function getItemWidth(){
      return vm.itemWidth + 'px';
    }

    function goBack(){
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);