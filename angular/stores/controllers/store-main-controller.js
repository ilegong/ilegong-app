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
      Stores.list().then(function(data){
        $rootScope.brands = data.brands;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      });
    }
  }
})(window, window.angular);