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
      vm.province = vm.city = vm.county = {};
      Addresses.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      if(vm.addressId < 0){
        return;
      }      

      Addresses.getAddressById(vm.addressId).then(function(address){
        vm.address = address;
        vm.province = _.find(vm.provinces, function(province){return province.id == vm.address.OrderConsignees.province_id});

        var orderConsignees = vm.address.OrderConsignees;        
        Addresses.getAddress(orderConsignees.province_id, orderConsignees.city_id, orderConsignees.county_id).then(function(data){
          vm.cities = data.city_list;
          vm.city = _.find(vm.cities, function(city){return city.id == vm.address.OrderConsignees.city_id});
          vm.counties = data.county_list;
          vm.county = _.find(vm.counties, function(county){return county.id == vm.address.OrderConsignees.county_id});
        });
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
      if(!Base.isMobilePhoneValid(t.mobilephone)){
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
      var t = vm.address.OrderConsignees;
      Addresses.editAddress(t.id,t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone).then(function(result){
        vm.onAddressUpdated();
      });
    }
    function addAddress(){
      var t = vm.address.OrderConsignees;
      Addresses.addAddress(t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone).then(function(result){
        vm.onAddressUpdated();
      });
    }
    function deleteAddress(addressId){
      Addresses.deleteAddress(addressId).then(function(data){
        $rootScope.alertMessage("已删除该收货地址");
        vm.onAddressUpdated();
      });
    }
    function onAddressUpdated(){
      Addresses.list().then(function(addresses){
        $rootScope.addresses = addresses;
        $ionicHistory.goBack();
      });
    }
  }   
})(window, window.angular);