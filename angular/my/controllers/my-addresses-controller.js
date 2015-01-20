(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAddressesCtrl', MyAddressesCtrl)

  function MyAddressesCtrl($q, $state, $ionicHistory, $stateParams, $log, $scope, $rootScope, Orders, Addresses){
    var vm = this;
    vm.isChecked = isChecked;
    vm.checkAddress = checkAddress;
    vm.editAddress = editAddress;
    activate();

    function activate() {
      vm.state = $stateParams.state;
      vm.addresses = [];
      vm.selectedAddress = {};
      Addresses.list().then(function(addresses){
        $rootScope.updateAddresses(addresses);
        vm.addresses = $rootScope.address.addresses;
      });
      $scope.$watch('address.addresses', function(newAddresses, oldAddresses){
        vm.addresses = newAddresses;
      });
    }
    function editAddress(addr){
      if(vm.state == 0){
        $state.go('app.my-address-edit',{editId: addr.OrderConsignees.id});
      }
      if(vm.state == 1){
        $state.go('app.order-address-edit',{editId: addr.OrderConsignees.id});
      }
    }
    function isChecked(address){
      return address.OrderConsignees.id == $rootScope.address.defaultAddress.OrderConsignees.id;
    }

    function checkAddress(address){
      Addresses.setDefaultAddress(address.OrderConsignees.id).then(function(result){
        $rootScope.address.defaultAddress = address;
        if(vm.state == 1){
          $ionicHistory.goBack();
        }
      });
    }
  }  
})(window, window.angular);