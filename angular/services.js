(function (window, angular) {
  "use strict";

  angular
  .module('app.services', [])
  .value('software', {app: {id: '201411290001', name: 'ailegong', version: ''}, server: {address: 'http://www.tongshijia.com', port: 80}})
  .service('Base', Base)
  .service('Products', Products)
  .service('Categories', Categories)

  /* @ngInject */
  function Base($http, $q, software){
    var self = this;
    return {
      get: get, 
      deferred: deferred
    }

    function get(url){
      // return $http.get(software.server.address + url);
      console.log("get data for " + url);
      var defer = $q.defer();
      defer.resolve(data[url]);
      return defer.promise;
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

})(window, window.angular);