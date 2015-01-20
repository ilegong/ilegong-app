(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAddressesCtrl', MyAddressesCtrl)

  function MyAddressesCtrl($q, $state, $ionicHistory, $stateParams, $log, $scope, $rootScope, Orders, Addresses){
    var vm = this;
    vm.isChecked = isChecked;
    vm.itemClick = itemClick;
    vm.setDefaultAddress = setDefaultAddress;
    vm.editAddress = editAddress;
    activate();

    function activate() {
      vm.state = $stateParams.state;
      vm.addrId = $stateParams.addrId;
      vm.editMode = false;
      Addresses.list().then(function(addresses) {
        vm.addresses = _.map(addresses, function(address){
          address.OrderConsignees.checked = vm.isChecked(address);
          return address;
        });
      })
    }

    function itemClick(addr){
      if(vm.state == 0){
        if(vm.editMode){
          vm.editAddress(addr);
        }
        else{
          vm.setDefaultAddress(addr.OrderConsignees.id);
        }
      }
      else{
        if(vm.editMode){
          vm.editAddress(addr);
        }
        else{
          console.log($rootScope.cart);
          $rootScope.cart['setAddressDefer'].resolve(addr);
          $ionicHistory.goBack();
        }
      }
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
        activate();
      });
    }
  }  
})(window, window.angular);