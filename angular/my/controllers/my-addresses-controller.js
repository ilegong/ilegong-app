(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAddressesCtrl', MyAddressesCtrl)

  function MyAddressesCtrl($q, $state, $ionicHistory, $stateParams, $log, $scope, $rootScope, Orders, Addresses){
    var vm = this;
    vm.isChecked = isChecked;
    vm.setDefaultAddress = setDefaultAddress;
    vm.addAddress = function(){$state.go('app.my-address-edit', {editId:-1})};
    vm.editAddress = editAddress;
    vm.isFromOrder = function(){return vm.state == 1};
    activate();

    function activate() {
      vm.state = $stateParams.state;
      vm.addresses = [];
      vm.defaultAddress = {};
      Addresses.list().then(function(addresses){
        $rootScope.updateAddresses(addresses);
        vm.addresses = $rootScope.address.addresses;
        vm.defaultAddress = $rootScope.address.defaultAddress;
      });
      $scope.$watch('address.addresses', function(newAddresses, oldAddresses){
        vm.addresses = newAddresses;
      });
      $scope.$watch('address.defaultAddress', function(newAddress, oldAddress){
        vm.defaultAddress = newAddress;
      });
    }
    function editAddress(addr){
      if(vm.isFromOrder()){
        $state.go('app.order-address-edit',{editId: addr.OrderConsignees.id});
      }
      else{
        $state.go('app.my-address-edit',{editId: addr.OrderConsignees.id});
      }
    }
    function isChecked(address){
      return address.OrderConsignees.id == vm.defaultAddress.OrderConsignees.id;
    }

    function setDefaultAddress(address){
      Addresses.setDefaultAddress(address.OrderConsignees.id).then(function(result){
        $rootScope.address.defaultAddress = address;
        vm.defaultAddress = address;
        if(vm.isFromOrder()){
          $ionicHistory.goBack();
        }
      });
    }
  }  
})(window, window.angular);