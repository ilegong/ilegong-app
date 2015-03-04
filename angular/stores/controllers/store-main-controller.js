(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreMainCtrl', StoreMainCtrl)

  /* @ngInject */
  function StoreMainCtrl($rootScope, $scope, $log, Stores){
    var vm = this;
    vm.doRefresh = doRefresh;
    vm.getItemWidth = getItemWidth;
    vm.getItemHeight = getItemHeight;
    activate();
    
    function activate(){
      vm.stores = $rootScope.brands;
      var deviceWidth = window.innerWidth;
      vm.itemWidth = Math.max((window.innerWidth - 10) / 2, 10);
      vm.imageHeight = vm.itemWidth - 10;
      vm.itemHeight = vm.imageHeight + 10 + 28;
      $log.log('item width is ' + vm.itemWidth);
      $scope.$watch('brands', function(newBrands, oldBrands){
        $log.log("brands has from ").log(oldBrands).log(" to: ").log(newBrands);
        vm.stores = newBrands;
      });
    }

    function doRefresh(){
      $rootScope.reloadStores(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      });
    }
    function getItemWidth(){
      return vm.itemWidth + 'px';
    }
    function getItemHeight(){
      return vm.itemHeight + 'px';
    }
  }
})(window, window.angular);