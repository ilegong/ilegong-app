(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreMainCtrl', StoreMainCtrl)

  /* @ngInject */
  function StoreMainCtrl($rootScope, $scope, $log, Stores){
    var vm = this;
    vm.doRefresh = doRefresh;
    activate();
    
    function activate(){
      vm.stores = $rootScope.brands;
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
  }
})(window, window.angular);