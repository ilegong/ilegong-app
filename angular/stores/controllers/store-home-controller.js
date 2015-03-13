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
      vm.loading = true;
      vm.loaded = false;
      vm.loadFailed = false;

      var deviceWidth = window.innerWidth;
      vm.itemWidth = Math.round((window.innerWidth - 10) / 2);
      vm.imageWidth = vm.itemWidth - 10 - 2; // 2px border
      vm.imageHeight = Math.round(vm.imageWidth * 3 / 4);
      var productNameHeight = 20;
      var priceHeight = 20;
      vm.itemHeight = Math.ceil(vm.imageHeight + productNameHeight + priceHeight + 22); // 10px padding + 10px divider + 2px border

      vm.loadData();
    }

    function loadData(){
      if(vm.loaded){
        return;
      }
      vm.loading = true;

      return Stores.getStore($rootScope.storeId).then(function(store){
        vm.store = store.content.info;
        vm.products = store.content.products;

        vm.loading = false;
        vm.loaded = true;
        vm.loadFailed = false;
      }, function(){
        vm.loaded = false;
        vm.loading = false;
        vm.loadFailed = true;
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