(function (window, angular) {
  "use strict";

  angular
  .module('app.services', [])
  .value('software', {staticData:true,app: {id: '201411290001', name: 'ailegong', version: ''}, server: {address: 'http://www.tongshijia.com', port: 80}})
  .service('Base', Base)
  .service('Products', Products)

  .service('Orders',Orders)


  .service('Categories', Categories)
  .service('OrderDetail',OrderDetail)


  .service("Stores", Stores)

  .service("Tryings", Tryings)
  .service("Offers",Offers)
  .service("Coupons",Coupons)
  .service('UserDetail',UserDetail)
  .service('Addresses',Addresses)
  /* @ngInject */
  function Base($http, $q, $log, software){
    var self = this;
    return {
      get: get, 
      deferred: deferred
    }

    function get(url){


      return deferred(data[url]);

      //return deferred(FakeData.get(url));

      return $http.get(software.server.address + url).then(
        function(data){
          return data.data;
        }, function(error){
          $log.error('Get ' + url + " error:").log(error);
          return error;
        }
      );

    }

    function deferred(data){
      var defer = $q.defer();
      defer.resolve(data);
      return defer.promise;
    }
  }

  /* @ngInject */

  function Products($log, Base,software){

    var self = this;
    return {
      list: list,
      getProduct:getProduct,
      getProductContent:getProductContent,
      getProductComment:getProductComment
    }

    function list(){
      $log.log('get /categories/mobileHome.json');
      return Base.get('/categories/mobileHome.json');

    }
    function getProduct(id){

      if(software.staticData)
        return Base.get('/api_orders/product_detail/293.json')
      else
        return Base.get('/api_orders/product_detail/'+id+'.json'); 
    }
    function getProductContent(id){
      if(software.staticData)
        return Base.get('productContent')
      else
        return Base.get('/apiOrders/product_content/'+id+'.json')
    }
    function getProductComment(id){
      if(software.staticData)
        return Base.get('productComment')
      else
        return Base.get('/comments/getlist/Product/'+id+'.json')

//      return Base.get('/api_orders/product_detail/'+id+'.json'); 

    }
  }

  function Categories(Base){
    var self = this;
    return {
      get: get
    }

    function get(slug){
      return Base.get("/categories/tag/" + slug + ".json");

    }
  }

  function Orders(Base,software){
    var self = this;

    return {
      list: list,
      allProvince: allProvince,
      getCities:getCities,
      getCounties:getCounties
    }

    function list(){
       return Base.get('/api_orders/mine.json?token=1');

    }
    function allProvince()
    {
      return Base.get('/Locations/get_province.json');
    }
    function getCities(id)
    {
      if(software.staticData)
        return Base.get('cities');
      else
        return Base.get('/Locations/get_city.json?provinceId='+id);
    }
    function getCounties(id)
    {
      if(software.staticData)
        return Base.get('counties');
      else
        return Base.get('/Locations/get_county.json?cityId='+id);
    }
  }

  function OrderDetail(Base)
  {
    var self = this;
    return {
      list: list
    }
    function list(){
      return Base.get('orderDetail')
    }
  }


  /* @ngInject */
  function Stores($log, Base){
    var self = this;

    return {
      list: list, 
      getStore: getStore, 
      getStoreIntro: getStoreIntro
    }

    function list(){
      return Base.get('/api_orders/store_list.json');
    }
    function getStore(id){
      return Base.get('/apiOrders/store_content/' + id + '.json');
    }
    function getStoreIntro(id){
      return Base.get('/apiOrders/store_story/' + id + '.json');
    }
  }

  /* @ngInject */
  function Tryings($log, Base){
    var self = this;

    return {
      list: list
    }

    function list(){
      return Base.get('/shichituan.json');
    }
  }
  function Offers($log,Base,software)
  {
    var self = this;
    return{
      list:list
    }
    function list(token){
        if(software.staticData)
        {
          return Base.get('Offers');
        }else
        {
         return Base.get('/api_orders/my_offers.json?token='+token);
        }
    }
  }

  function UserDetail($log,Base,software)
  {
    var self = this;
    return{
      list:list
    }
    function list(token)
    {
      if(software.staticData)
      {
        return Base.get('Profile');
      }
      else
      {
        return Base.get('/api_orders/my_profile.json?token='+ token);
      }

    }
  }
  function Addresses(Base,software)
  {
    var self = this;
    return{
      list:list,
      getAddress:getAddress
    }
    function list(token)
    {

      if(software.staticData)
      {
        return Base.get('Addresses');
      }
      else
      {
        return Base.get('/api_orders/order_consignees.json?token='+ token);
      }
    }
    function getAddress(provinceId,cityId,countyId)
    {
      if(software.staticData)
      {
        return Base.get('Address');
      }
      else
      {
        return Base.get('/Locations/get_address.json?province_id='+provinceId+'&city_id='+cityId+'&county_id='+countyId);
      }
    }
  }
  function Coupons($log,Base,software)
  {
    var self = this;
    return{
      list:list
    }
    function list(token)
    {
      if(software.staticData)
      {
        return Base.get('Coupons');
      }
      else
      {
        return Base.get('/api_orders/my_coupons.json?token='+token);
      }
    }
  }
})(window, window.angular);