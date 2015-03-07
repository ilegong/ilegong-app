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
      vm.imageWidth = vm.itemWidth - 10 - 2; // 2px border
      vm.imageHeight = vm.imageWidth;
      var brandNameHeight = 20;
      vm.itemHeight = vm.imageHeight + brandNameHeight + 22; // 10px padding + 10px divider + 2px border

      $scope.$watch('brands', function(newBrands, oldBrands){
        vm.stores = $rootScope.brands;
      });
    }

    function doRefresh(){
      $rootScope.reloadStores().then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      }, function(){
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