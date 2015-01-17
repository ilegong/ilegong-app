(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service("Coupons", Coupons)
  
  function Coupons($q,$log,Base,software,Users){
    var self = this;
    return{
      getCoupons: getCoupons
    }
    function getCoupons() {
      var defer = $q.defer(); 
      Base.get('/api_orders/my_coupons.json?access_token='+Users.getTokenLocally().access_token).then(function(item){
        defer.resolve(item);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }
})(window, window.angular);