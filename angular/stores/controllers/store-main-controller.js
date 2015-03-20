(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreMainCtrl', StoreMainCtrl)

  /* @ngInject */
  function StoreMainCtrl($rootScope, $scope, $log, Stores){
    var vm = this;
    vm.loadData = loadData;
    vm.getItemHeight = getItemHeight;
    vm.updateStore = updateStore;
    activate();
    
    function activate(){
      vm.loadStatus = new LoadStatus();
      vm.updateStore($rootScope.brands);
      vm.imageHeight = window.innerWidth / 2 - 15 - 2; // 15px padding, 2px border
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
    function getItemHeight(){
      return vm.itemHeight + 'px';
    }
  }
})(window, window.angular);