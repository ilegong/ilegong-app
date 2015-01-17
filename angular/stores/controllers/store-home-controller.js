(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreHomeCtrl', StoreHomeCtrl)

  /* @ngInject */
  function StoreHomeCtrl($rootScope, $scope, $stateParams, Stores){
    var vm = this;
    vm.storeId = $stateParams.storeId;
    activate();

    function activate(){
    }
  }
})(window, window.angular);