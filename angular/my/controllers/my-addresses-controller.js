(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAddressesCtrl', MyAddressesCtrl)

  function MyAddressesCtrl($q, $state, $ionicHistory, $stateParams, $log, $scope, $rootScope, Orders, Addresses){
    var vm = this;
    vm.isChecked = isChecked;
    vm.setDefaultAddress = setDefaultAddress;
    vm.addAddress = addAddress;
    vm.editAddress = editAddress;
    activate();

    function activate() {
      vm.state = $stateParams.state;
      vm.addrId = $stateParams.addrId;
      Addresses.list().then(function(addresses) {
        vm.addresses = _.map(addresses, function(address){
          address.OrderConsignees.checked = vm.isChecked(address);
          return address;
        });
      });
      $scope.$watch('addresses', function(newAddresses, oldAddresses){
        $log.log('address has been updated');
        vm.addresses = newAddresses;
      });
    }

    function editAddress(addr){
      $rootScope['editAddress'] = {};
      $rootScope['editAddress']['defer'] = $q.defer();
      var id = -1;
      if(addr !=null){
        id = addr.OrderConsignees.id;
      }
      if(vm.state == 0){
        $state.go('app.my-address-edit',{editId:id});

      }
      if(vm.state == 1){
        $state.go('app.order-address-edit',{editId:id});
      }
      $rootScope['editAddress']['defer'].promise.then(function(data){
        activate();
      })
    }
    function addAddress(){

    }
    function isChecked(address){
      if(vm.state == 0){
        return address.OrderConsignees.status == 1;
      }
      if(vm.state == 1){
        return vm.addrId == address.OrderConsignees.id;
      }
    }

    function setDefaultAddress(id){
      Addresses.setDefaultAddress(id).then(function(result){
        if(vm.state == 0){
          _.each(vm.addresses, function(address){
             address.OrderConsignees.checked = address.OrderConsignees.id == id;
          });
        }
        else{
          $rootScope.cart['setAddressDefer'].resolve(addr);
          $ionicHistory.goBack();
        }
      });
    }
  }  
})(window, window.angular);