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
      return Base.get('/api_orders/my_coupons.json?access_token='+Users.getTokenLocally().access_token);
    }
  }
})(window, window.angular);