(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAddressesCtrl', MyAddressesCtrl)

  function MyAddressesCtrl($q,$state,$ionicHistory,$stateParams,$log,$scope,$rootScope,Orders,Addresses){
    var vm = this;
    vm.state = $stateParams.state;
    vm.addrId = $stateParams.addrId;
    vm.itemClick = itemClick;
    vm.setDefaultAddress = setDefaultAddress;
    vm.editAddress = editAddress;
    vm.getEditText = getEditText;
    activate();

    function activate() {
      Addresses.list().then(function(data) {
        vm.addresses = data;
      })
      vm.asd=0;
      vm.editModel = false;
    }
    function getEditText(){
      return vm.editMode?'完成':'编辑';
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

    vm.isChecked = function(addr){
      if(vm.state == 0){
        return addr.OrderConsignees.status == 1;
      }
      if(vm.state == 1){
        return vm.addrId == addr.OrderConsignees.id;
      }
    }

    function setDefaultAddress(id){
      Addresses.def(id).then(function(result){
        activate();
      })
    }
  }  
})(window, window.angular);