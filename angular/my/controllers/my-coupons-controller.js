(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyCouponsCtrl',MyCouponsCtrl)
  
  function MyCouponsCtrl($state,$scope, $rootScope, $log, Coupons) {
    var vm = this;
    vm.getBrand = getBrand;
    vm.getCouponStatus = getCouponStatus;
    vm.doRefresh = doRefresh;
    vm.useCoupons = useCoupons;
    activate();

    function activate() {
      vm.validCoupons = [];
      vm.invalidCoupons = [];
      vm.showInvalidCoupons = false;
      vm.currentDate = new Date();
      Coupons.getCoupons().then(function(data){
        _.each(data.coupons, function(coupon){
          coupon.Coupon.valid_begin = new Date(coupon.Coupon.valid_begin);
          coupon.Coupon.valid_end = new Date(coupon.Coupon.valid_end);
        });
        vm.validCoupons = _.filter(data.coupons, function(coupon){return coupon.Coupon.status == 1 && coupon.Coupon.valid_end >= vm.currentDate});
        vm.invalidCoupons = _.filter(data.coupons, function(coupon){return coupon.Coupon.status != 1 || coupon.Coupon.valid_end < vm.currentDate});
        vm.brands = _.map(data.brands, function(brand){return brand});
      })
    }
    function isNumberInvalid(num){
      if(num == null || num == 0){
        return true;
      }
      else{
        return false;
      }
    }
    function useCoupons(coupon,brand){
      if(!isNumberInvalid(coupon.Coupon.brand_id)){
        $state.go('store.home',{storeId: brand.Brand.id});
      }
      else if(!isNumberInvalid(coupon.Coupon.product_list)){
        $state.go('app.product-detail-o',{id:coupon.Coupon.product_list[0],from:-2});
      }
      else if(!isNumberInvalid(coupon.Coupon.category_id) && false){ //  去专场，咱不实现

      }
      else{
        $state.go('app.home');
      }
    }

    function getBrand(brandId){
      return _.find(vm.brands, function(brand){return brand.Brand.id == brandId});
    }
    function doRefresh(){
      Coupons.getCoupons().then(function(data){
        _.each(data.coupons, function(coupon){
          coupon.Coupon.valid_begin = new Date(coupon.Coupon.valid_begin);
          coupon.Coupon.valid_end = new Date(coupon.Coupon.valid_end);
        });
        vm.validCoupons = _.filter(data.coupons, function(coupon){return coupon.Coupon.status == 1 && coupon.Coupon.valid_end >= vm.currentDate});
        vm.invalidCoupons = _.filter(data.coupons, function(coupon){return coupon.Coupon.status != 1 || coupon.Coupon.valid_end < vm.currentDate});
        vm.brands = _.map(data.brands, function(brand){return brand});
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
    function getCouponStatus(coupon){
      if(_.isEmpty(coupon)){
        return "使用";
      }
      if(coupon.Coupon.status == 2){
        return "已使用";
      }
      if(coupon.Coupon.valid_end < vm.currentDate){
        return "已过期";
      }
      return "使用"
    }
  } 
})(window, window.angular);