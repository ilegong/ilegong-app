(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyCouponsCtrl',MyCouponsCtrl)
  
  function MyCouponsCtrl($scope,$rootScope,Coupons) {
    var vm = this;
    vm.couponStates = [
      {state:1, value:'有效', available: true},
      {state:1, value:'可用', available: true},
      {state:2, value:'已使用', available: false}
    ];
    vm.getCouponValue = getCouponValue;
    vm.isCouponAvailable = isCouponAvailable;

    activate();

    function activate() {
      Coupons.getCoupons().then(function(data){
        vm.coupons = data.coupons;
        vm.brands = _.map(data.brands, function(brand){return brand});
      })
    }
    function getCouponValue(state){
      return _.find(vm.couponStates, function(couponState){return couponState.state == state}).value;
    }
    function isCouponAvailable(state){
      return _.any(vm.couponStates, function(couponState){return couponState.state == state && couponState.available == true});
    }
  } 
})(window, window.angular);