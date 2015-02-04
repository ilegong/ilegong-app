(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreMainCtrl', StoreMainCtrl)

  /* @ngInject */
  function StoreMainCtrl($rootScope, $scope, Stores){
    var vm = this;
    activate();
    
    function activate(){
      vm.stores = $rootScope.brands;
      if(_.isEmpty($rootScope.brands)){
        Stores.list().then(function(data){
          $rootScope.brands = data.brands;
        });
      }
      $scope.$watch('brands', function(newBrands, oldBrands){
        vm.stores = newBrands;
      });
    }
  }
})(window, window.angular);