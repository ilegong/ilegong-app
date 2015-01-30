(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Addresses', Addresses)

  function Addresses($log,$q,Base,config,Users){
    var self = this;
    return{
      list:list,
      getAddress:getAddress,
      deleteAddress: deleteAddress,
      editAddress: editAddress,
      addAddress: addAddress,
      setDefaultAddress: setDefaultAddress, 
      getProvinces: getProvinces,
      getCities: getCities,
      getCounties: getCounties
    }
    function list(accessToken){
      return Base.get('/api_orders/order_consignees.json?access_token='+accessToken);
    }
    function getAddress(provinceId,cityId,countyId, accessToken){
      var defer = $q.defer();
      Base.get('/Locations/get_address.json?province_id='+provinceId+'&city_id='+cityId+'&county_id='+countyId+'&access_token='+accessToken).then(function(result){
        defer.resolve({
          'histories': _.map(result.histories, function(name, id){return {id: id, name: name}}), 
          'city_list': _.map(result.city_list, function(name, id){return {id: id, name: name}}), 
          'county_list': _.map(result.county_list, function(name, id){return {id: id, name: name}})
        });
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function deleteAddress(id, accessToken){
      return Base.get('/api_orders/delete_consignee/'+id+'.json?access_token='+accessToken);
    }
    function editAddress(id,name,address,province_id,city_id,county_id,mobilephone, accessToken){
      return Base.get('/api_orders/info_consignee.json?access_token='+accessToken+'&type=edit&id='+id+'&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone);
    }
    function addAddress(name,address,province_id,city_id,county_id,mobilephone, accessToken){
      return Base.get('/api_orders/info_consignee.json?access_token='+accessToken+'&type=create&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone);
    }
    function setDefaultAddress(id, accessToken){
      return Base.get('/api_orders/info_consignee.json?access_token='+accessToken+'&type=default&id='+id);
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