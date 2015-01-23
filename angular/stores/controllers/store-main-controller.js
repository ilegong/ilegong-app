(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreMainCtrl', StoreMainCtrl)

  /* @ngInject */
  function StoreMainCtrl($rootScope, $scope, Stores){
    var vm = this;
    activate();
    
    function activate(){
      Stores.list().then(function(data){
        vm.stores = data.brands;
      });
    }
  }
})(window, window.angular);