(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service("Stores", Stores)

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
      Base.get('/apiOrders/store_content/' + id + '.json').then(function(data){
        console.log(data);
      })
      return Base.get('/apiOrders/store_content/' + id + '.json');
    }
    function getStoreIntro(id){
      return Base.get('/apiOrders/store_story/' + id + '.json');
    }
  }
})(window, window.angular);