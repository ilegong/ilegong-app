(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreMainCtrl', StoreMainCtrl)

  /* @ngInject */
  function StoreMainCtrl($rootScope, $scope, $log, Stores){
    var vm = this;
    vm.loadData = loadData;
    vm.getItemWidth = getItemWidth;
    vm.getItemHeight = getItemHeight;
    vm.updateStore = updateStore;
    activate();
    
    function activate(){
      vm.loadStatus = new LoadStatus();
      vm.updateStore($rootScope.brands);
      var deviceWidth = window.innerWidth;
      vm.itemWidth = Math.max((window.innerWidth - 10) / 2, 10);
      vm.imageWidth = vm.itemWidth - 10 - 2; // 2px border
      vm.imageHeight = vm.imageWidth;
      var brandNameHeight = 20;
      vm.itemHeight = vm.imageHeight + brandNameHeight + 22; // 10px padding + 10px divider + 2px border

      $scope.$watch('brands', function(newBrands, oldBrands){
        vm.updateStore($rootScope.brands);
      });
    }

    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();

      return $rootScope.reloadStores();
    }
    function updateStore(stores){
      vm.loadStatus.startLoading();
      if(!_.isEmpty(stores)){
        vm.loadStatus.succeeded();
      }
      else{
        vm.loadStatus.failed(0);
      }
      vm.stores = stores;
    }
    function getItemWidth(){
      return vm.itemWidth + 'px';
    }
    function getItemHeight(){
      return vm.itemHeight + 'px';
    }
  }
})(window, window.angular);