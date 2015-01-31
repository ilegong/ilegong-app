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
    vm.doRefresh = doRefresh;
    activate();

    function activate() {
      vm.state = $stateParams.state;
      vm.addresses = $rootScope.user.addresses;
      vm.defaultAddress = $rootScope.getDefaultAddress();
      $rootScope.$on("addressChanged", function(event, addresses){
        vm.addresses = $rootScope.user.addresses;
        vm.defaultAddress = $rootScope.getDefaultAddress();
        $log.log('default address changed to: ').log(vm.defaultAddress);
      });
    }
    function doRefresh(){
      if(!$rootScope.user.loggedIn){
        return $state.go('app.my-account-login');
      }
      reloadAddresses($rootScope.user.token.access_token);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
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
      if(_.isEmpty(vm.defaultAddress)){
        return false;
      }
      return address.OrderConsignees.id == vm.defaultAddress.OrderConsignees.id;
    }

    function setDefaultAddress(defaultAddress){
      if(!$rootScope.user.loggedIn){
        return $state.go('app.my-account-login');
      }
      Addresses.setDefaultAddress(defaultAddress.OrderConsignees.id, $rootScope.user.token.access_token).then(function(result){
        $rootScope.reloadAddresses($rootScope.user.token.access_token);
        if(vm.isFromOrder()){
          $ionicHistory.goBack();
        }
        else{
          $rootScope.alertMessage("已修改默认收货地址");
        }
      });
    }
  }  
})(window, window.angular);