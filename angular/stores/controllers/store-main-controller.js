(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreMainCtrl', StoreMainCtrl)

  /* @ngInject */
  function StoreMainCtrl($rootScope, $scope, Stores){
    var vm = this;
    vm.doRefresh = doRefresh;
    activate();
    
    function activate(){
      vm.stores = $rootScope.brands;
      $scope.$watch('brands', function(newBrands, oldBrands){
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