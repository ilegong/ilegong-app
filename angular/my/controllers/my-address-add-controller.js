(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAddressAddCtrl', MyAddressAddCtrl)

  function MyAddressAddCtrl($ionicHistory,$log,$scope,$rootScope,$stateParams,Addresses, Orders){
    var vm = this;
    vm.addAddress = addAddress;
    vm.editAddress = editAddress;
    vm.deleteAddress = deleteAddress;
    vm.onProvinceChanged = onProvinceChanged;
    vm.onCityChanged = onCityChanged;
    activate();
    function activate(){
      vm.addressId = $stateParams.editId;  
      vm.cities = vm.counties = [];
      vm.province = vm.city = vm.county = {};
      Addresses.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });      
      if(addressId == -1){
        return;
      }
      Addresses.getAddressById(addressId).then(function(address){
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
      if(_.isEmpty(province)){
        return;
      }
      Addresses.getCities(province.id).then(function(cities){
        vm.cities = cities;
      });
    }
    function onCityChanged(city) {
      vm.counties = [];
      if(_.isEmpty(city)){
        return;
      }
      Addresses.getCounties(city.id).then(function(counties){
        vm.counties = counties;
      });
    }
    vm.save = function(){
      var promise;
      if(_.isEmpty(vm.address.OrderConsignees.id)){
        promise = vm.addAddress();
      }
      else{
        promise = vm.editAddress(vm.address.OrderConsignees.id);
      }
      promise.then(function(data){
        $rootScope['editAddress']['defer'].resolve(null);
        $ionicHistory.goBack();
      })

      
    }
    function editAddress(){
      var t = vm.address.OrderConsignees;
      return Addresses.editAddress(t.id,t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone);
    }
    function addAddress(){
      var t = vm.address.OrderConsignees;
      return Addresses.addAddress(t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone);
    }
    function deleteAddress(addressId){
      Addresses.deleteAddress(addressId).then(function(data){
        $rootScope['editAddress']['defer'].resolve(null);
        $ionicHistory.goBack();
      });
    }
  }   
})(window, window.angular);