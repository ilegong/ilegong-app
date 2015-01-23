(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyCouponsCtrl',MyCouponsCtrl)
  
  function MyCouponsCtrl($scope, $rootScope, $log, Coupons) {
    var vm = this;
    vm.getBrand = getBrand;

    activate();

    function activate() {
      vm.validCoupons = [];
      vm.invalidCoupons = [];
      vm.showInvalidCoupons = false;
      Coupons.getCoupons().then(function(data){
        _.each(data.coupons, function(coupon){
          if(coupon.Coupon.status == 2){
            coupon.Coupon.valid = false;
            coupon.Coupon.desc = "已使用";
            return;
          }
          if (new Date(coupon.Coupon.valid_end) < new Date()){
            coupon.Coupon.valid = false;
            coupon.Coupon.status = '已过期';
            return;
          }
          coupon.Coupon.valid = true;
          coupon.Coupon.status = '可使用';
        });
        vm.validCoupons = _.filter(data.coupons, function(coupon){return coupon.Coupon.valid});
        vm.invalidCoupons = _.filter(data.coupons, function(coupon){return !coupon.Coupon.valid});
        $log.log('valid coupons: ').log(vm.validCoupons);
        $log.log('invalid coupons: ').log(vm.invalidCoupons.length);
        vm.brands = _.map(data.brands, function(brand){return brand});
      })
    }
    function getBrand(brandId){
      return _.find(vm.brands, function(brand){return brand.Brand.id == brandId});
    }
  } 
})(window, window.angular);