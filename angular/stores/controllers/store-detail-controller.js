(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreDetailCtrl', StoreDetailCtrl)

  /* @ngInject */
  function StoreDetailCtrl($rootScope, $scope, $stateParams, Stores){
    var vm = this;
    activate();
    
    function activate(){
      vm.storeId = $stateParams.storeId;
      Stores.getStore(vm.storeId).then(function(data){
        vm.store = data.content;
      });
    }
  }
})(window, window.angular);