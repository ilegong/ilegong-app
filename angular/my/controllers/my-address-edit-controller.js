(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAddressEditCtrl',MyAddressEditCtrl)

  function MyAddressEditCtrl($ionicHistory,$log,$scope,$rootScope,$stateParams, Base, Addresses, Orders){
    var vm = this;
    vm.addAddress = addAddress;
    vm.editAddress = editAddress;
    vm.deleteAddress = deleteAddress;
    vm.onProvinceChanged = onProvinceChanged;
    vm.onCityChanged = onCityChanged;
    vm.onAddressUpdated = onAddressUpdated;
    vm.verifyMobilePhone = verifyMobilePhone;
    vm.isMobilePhoneValid = isMobilePhoneValid;
    vm.readyToSave = readyToSave;
    activate();
    function activate(){
      vm.addressId = $stateParams.editId;  
      vm.address = {OrderConsignees: {}};
      vm.cities = vm.counties = [];
      vm.city = vm.county = {};
      vm.provinces = $rootScope.provinces;
      if(vm.addressId < 0){
        return;
      }      

      vm.address = _.find($rootScope.user.addresses, function(address){return address.OrderConsignees.id == vm.addressId});
      var orderConsignees = vm.address.OrderConsignees;        
      vm.province = _.find(vm.provinces, function(province){return province.id == orderConsignees.province_id}) || {};

      Addresses.getAddress(orderConsignees.province_id, orderConsignees.city_id, orderConsignees.county_id, $rootScope.user.token.access_token).then(function(data){
        vm.cities = data.city_list;
        vm.city = _.find(vm.cities, function(city){return city.id == vm.address.OrderConsignees.city_id});
        vm.counties = data.county_list;
        vm.county = _.find(vm.counties, function(county){return county.id == vm.address.OrderConsignees.county_id});
      });
    }
    function onProvinceChanged(province){
      vm.cities = vm.counties = [];
      vm.city = vm.county = {};
      if(_.isEmpty(province)){
        return;
      }
      Addresses.getCities(province.id).then(function(cities){
        vm.cities = cities;
      });
    }
    function onCityChanged(city) {
      vm.counties = [];
      vm.county = {};
      if(_.isEmpty(city)){
        return;
      }
      Addresses.getCounties(city.id).then(function(counties){
        vm.counties = counties;
      });
    }
    function verifyMobilePhone(){
      var t = vm.address.OrderConsignees;
      if(!vm.isMobilePhoneValid(t.mobilephone)){
        $rootScope.alertMessage("手机号输入错误");
      }
      else{
        $rootScope.alert.message = "";
      }
    }
    function readyToSave(){
      var t = vm.address.OrderConsignees;
      return !_.isEmpty(t.name) && !_.isEmpty(t.address) && vm.isMobilePhoneValid(t.mobilephone) && !_.isEmpty(vm.province) && !_.isEmpty(vm.city) && !_.isEmpty(vm.county);
    }
    function editAddress(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      var t = vm.address.OrderConsignees;
      Addresses.editAddress(t.id,t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone, $rootScope.user.token.access_token).then(function(result){
        vm.onAddressUpdated($rootScope.user.token.access_token);
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? "网络连接不可用，请稍后重试" : "修改地址失败，请重试");
      });
    }
    function addAddress(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      var t = vm.address.OrderConsignees;
      Addresses.addAddress(t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone, $rootScope.user.token.access_token).then(function(result){
        vm.onAddressUpdated($rootScope.user.token.access_token);
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? "网络连接不可用，请稍后重试" : "添加地址失败，请重试");
      });
    }
    function deleteAddress(addressId){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      Addresses.deleteAddress(addressId, $rootScope.user.token.access_token).then(function(data){
        $rootScope.alertMessage("已删除该收货地址");
        vm.onAddressUpdated($rootScope.user.token.access_token);
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? "网络连接不可用，请稍后重试" : "删除地址失败，请重试");
      });
    }
    function onAddressUpdated(accessToken){
      $rootScope.reloadAddresses(accessToken).then(function(){
        $ionicHistory.goBack();
      });
    }
    function isMobilePhoneValid(mobilePhone){
      if(_.isEmpty(mobilePhone)){
        return false;
      }
      return /^1[3-8][0-9]\d{8}$/.test(mobilePhone.replace(/-/g, ""));
    }
  }   
})(window, window.angular);