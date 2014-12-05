(function (window, angular) {
  "use strict";

  angular
  .module('app.services', [])
  .value('software', {app: {id: '201411290001', name: 'ailegong', version: ''}, server: {address: 'http://www.tongshijia.com', port: 80}})
  .service('Base', Base)
  .service('Products', Products)

  .service('Orders',Orders)
  .service('Offers',Offers)

  .service('Categories', Categories)
  .service('OrderDetail',OrderDetail)

  /* @ngInject */
  function Base($http, $q, $log, software){
    var self = this;
    return {
      get: get, 
      deferred: deferred
    }

    function get(url){
      return $http.get(software.server.address + url).then(
        function(data){
          $log.info("Get url " + url + " success:").log(data.data);
          return data.data;
        }, function(error){
          $log.error('Get ' + url + " error:").log(error);
          return error;
        });
      // return deferred(data[url]);
    }

    function deferred(data){
      var defer = $q.defer();
      defer.resolve(data);
      return defer.promise;
    }
  }

  /* @ngInject */
  function Products(Base){
    var self = this;

    return {
      list: list
    }

    function list(){

      return Base.get('/categories/mobileHome.json');
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

  function Orders(Base){
    var self = this;

    return {
      list: list
    }

    function list(){
       return Base.get('/api_orders/mine.json?token=1');

    }
  }

  function Offers(Base){
    var self = this;

    return {
      list: list
    }

    function list(){
      // return Base.get('/categories/mobileHome.json');
      var sample = {offers:[
      new Offer('n1','d1',11.1,1,'http://baidu.com'),
      new Offer('n2','d2',3.54,1,'http://baidu.com'),
      new Offer('n3','d3',3,2,'http://baidu.com'),
      new Offer('n4','d4',1.2,2,'http://baidu.com'),
      new Offer('n5','d5',5.5,3,'http://baidu.com'),
      new Offer('n6','d6',3.2,3,'http://baidu.com')

    ]};
      return Base.deferred(sample);
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
})(window, window.angular);