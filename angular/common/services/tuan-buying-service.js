(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('TuanBuyings', TuanBuyings)

  /* @ngInject */
  function TuanBuyings($q,$log, Base,config,Users){
    var self = this;
    return {
      getTuanBuying: getTuanBuying,
    }

    function getTuanBuying(id){
      var defer = $q.defer();
      Base.get('/api_orders/product_detail/'+id+'.json').then(function(product){
        defer.resolve(product);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }
})(window, window.angular);