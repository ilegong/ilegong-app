(function (window, angular) {
  "use strict";

  angular
  .module('app.services', ['LocalForageModule'])
  .value('software', {fakeData: true, app: {id: '201411290001', name: 'ailegong', version: ''}, server: {address: 'http://www.tongshijia.com', port: 80}})
  .service('Base', Base)
  .service('Users', Users)
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
      if(software.fakeData){
        return deferred(FakeData.get(url));
      }
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
  function Users($window, $localForage, $log, $q, software, Base){
    var self = this;
    self.user = null;
    $window.device = $window.device || {};
    return {
      loadUserLocally: loadUserLocally,
      isUserLoggedIn: function(){return !_.isEmpty(self.user);},
      getUserFromCache: function(){return self.user;},
      register: register
    }

    function loadUserLocally(){
      if(software.fakeData){
        return;
      }

      return $localForage.getItem('user').then(function(item) {
        if(!_.isEmpty(item)){
          self.user = item;
        }
        return self.user;
      });
    }
    function register(){
      var data = {app_id: Base.app().id, device_uuid: $window.device.uuid, device_platform: $window.device.platform, device_model: $window.device.model, device_version: $window.device.version}
      return Base.post('/login', data).then(function(item){
        self.user = item;
        $localForage.setItem('user', self.user);
        return self.user;
      });
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
        return Base.get('/api_orders/product_detail/'+id+'.json'); 
    }
    function getProductContent(id){
      return Base.get('/apiOrders/product_content/'+id+'.json')
    }
    function getProductComment(id){
      return Base.get('/comments/getlist/Product/'+id+'.json')
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
      return Base.get('/Locations/get_city.json?provinceId='+id);
    }
    function getCounties(id)
    {
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
      return Base.get('/orderDetail')
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
      return Base.get('/api_orders/my_offers.json?token='+token);
    }
  }

  function UserDetail($log,Base,software)
  {
    var self = this;
    return{
      list:list
    }
    function list(token){
      return Base.get('/api_orders/my_profile.json?token='+ token);
    }
  }
  function Addresses(Base,software)
  {
    var self = this;
    return{
      list:list,
      getAddress:getAddress
    }
    function list(token){
      return Base.get('/api_orders/order_consignees.json?token='+ token);
    }
    function getAddress(provinceId,cityId,countyId){
      return Base.get('/Locations/get_address.json?province_id='+provinceId+'&city_id='+cityId+'&county_id='+countyId);
    }
  }
  function Coupons($log,Base,software)
  {
    var self = this;
    return{
      list:list
    }
    function list(token) {
      return Base.get('/api_orders/my_coupons.json?token='+token);
    }
  }
})(window, window.angular);