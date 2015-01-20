(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Addresses', Addresses)

  function Addresses($log,$q,Base,software,Users){
    var self = this;
    return{
      list:list,
      getAddressById: getAddressById, 
      getAddress:getAddress,
      getDefaultAddress: getDefaultAddress, 
      deleteAddress: deleteAddress,
      editAddress: editAddress,
      addAddress: addAddress,
      setDefaultAddress: setDefaultAddress, 
      getProvinces: getProvinces,
      getCities: getCities,
      getCounties: getCounties
    }
    function list(){
      return Base.get('/api_orders/order_consignees.json?access_token='+Users.getTokenLocally().access_token);
    }
    function getDefaultAddress(){
      return list().then(function(addresses){
        var defaultAddress =  _.find(addresses, function(address){return address.OrderConsignees.status == 1});
        if(_.isEmpty(defaultAddress) && addresses.length > 0){
          defaultAddress = addresses[0];
        }
        return defaultAddress;
      });
    }
    function getAddressById(id){
      return list().then(function(addresses){
        return _.find(addresses, function(address){return address.OrderConsignees.id == id});
      });
    }
    function getAddress(provinceId,cityId,countyId){
      var defer = $q.defer();
      Base.get('/Locations/get_address.json?province_id='+provinceId+'&city_id='+cityId+'&county_id='+countyId+'&access_token='+Users.getTokenLocally().access_token).then(function(result){
        defer.resolve({
          'histories': _.map(result.histories, function(name, id){return {id: id, name: name}}), 
          'city_list': _.map(result.city_list, function(name, id){return {id: id, name: name}}), 
          'county_list': _.map(result.county_list, function(name, id){return {id: id, name: name}})
        });
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function deleteAddress(id){
      return Base.get('/api_orders/delete_consignee/'+id+'.json?access_token='+Users.getTokenLocally().access_token);
    }
    function editAddress(id,name,address,province_id,city_id,county_id,mobilephone){
      return Base.get('/api_orders/info_consignee.json?access_token='+Users.getTokenLocally().access_token+'&type=edit&id='+id+'&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone);
    }
    function addAddress(name,address,province_id,city_id,county_id,mobilephone){
      return Base.get('/api_orders/info_consignee.json?access_token='+Users.getTokenLocally().access_token+'&type=create&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone);
    }
    function setDefaultAddress(id){
      return Base.get('/api_orders/info_consignee.json?access_token='+Users.getTokenLocally().access_token+'&type=default&id='+id);
    }
    function getProvinces(){
      return Base.get('/Locations/get_province.json').then(function(provinces){
        return _.map(provinces, function(name, id){return {'id': id, 'name': name}})
      });
    }
    function getCities(id){
      return Base.get('/Locations/get_city.json?provinceId='+id).then(function(cities){
        return _.map(cities, function(name, id){return {id: id, name: name}});
      });
    }
    function getCounties(id){
      return Base.get('/Locations/get_county.json?cityId='+id).then(function(counties){
        return _.map(counties, function(name, id){return {id: id, name: name}});
      });
    }
  }
})(window, window.angular);