(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service("Coupons", Coupons)
  
  function Coupons($q,$log,Base,config,Users){
    var self = this;
    return{
      getCoupons: getCoupons
    }
    function getCoupons(accessToken) {
      return Base.get('/api_orders/my_coupons.json?access_token=' + accessToken);
    }
  }
})(window, window.angular);