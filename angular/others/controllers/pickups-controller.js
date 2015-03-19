(function ($window, angular) {
  "use strict";

  angular.module('module.others')
  .controller('PickupsCtrl', PickupsCtrl)

  function PickupsCtrl($q, $state, $ionicHistory, $stateParams, $log, $scope, $rootScope, Orders, Addresses){
    var vm = this;
    vm.checkPickup = checkPickup;
    activate();

    function activate() {
      vm.shippment = $rootScope.user.cartInfo.shippment;
    }
    function checkPickup(pickup){
      vm.shippment.checkPickup(pickup);
      $ionicHistory.goBack();
    }
  }  
})(window, window.angular);