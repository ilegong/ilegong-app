(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartConfirmationCtrl', CartConfirmationCtrl)

  function CartConfirmationCtrl($q,$ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders, Carts,Coupons){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.getPriceOfProduct = getPriceOfProduct;
    vm.getPriceOfBrand = getPriceOfBrand;
    vm.getShipFeeOfBrand = getShipFeeOfBrand;
    vm.countOfProducts = countOfProducts;
    vm.changeAddress = changeAddress;
    vm.getBrandById = getBrandById;
    vm.confirmCouponCode = confirmCouponCode;
    vm.submitOrder = submitOrder;
    vm.isSiteCoupons = isSiteCoupons;
    vm.setSiteCoupon = setSiteCoupon;
    vm.showProductCoupon = showProductCoupon;
    vm.setBrandOrProductCoupon = setBrandOrProductCoupon;
    vm.getPidList = getPidList;
    vm.readyToSubmitOrder = readyToSubmitOrder;
    activate();

    function activate(){
      vm.provinces = $rootScope.provinces;
      vm.brands = $rootScope.brands;
      vm.defaultAddress = $rootScope.getDefaultAddress();

      vm.confirmedBrandItems = $rootScope.user.cartInfo.cart.brandItems;
      vm.shipFees = $rootScope.user.cartInfo.shipFees; 
      vm.totalShipFees = _.reduce(vm.shipFees, function(memo, shipFee){return memo + shipFee}, 0);
      vm.reduced = $rootScope.user.cartInfo.reduced;
      vm.totalPrice = $rootScope.user.cartInfo.total_price;

      vm.validCoupons = $rootScope.user.validCoupons;
      vm.invalidCoupons = $rootScope.user.invalidCoupons;

      $rootScope.$on("addressChanged", function(event, addresses){
        vm.defaultAddress = $rootScope.getDefaultAddress();
      });
      $scope.$watch("user.cartInfo", function(){
        vm.confirmedBrandItems = $rootScope.user.cartInfo.cart.brandItems;
        vm.shipFees = $rootScope.user.cartInfo.shipFees; 
        vm.totalShipFees = _.reduce(vm.shipFees, function(memo, shipFee){return memo + shipFee}, 0);
        vm.reduced = $rootScope.user.cartInfo.reduced;
        vm.totalPrice = $rootScope.user.cartInfo.total_price + $rootScope.user.cartInfo.shipFee;
      });
    }
    function setBrandOrProductCoupon(coupon,brand,products){
      if(coupon.isChecked){//checked
        if(brand.coupons.length >= _.pairs(products).length){
          coupon.isChecked = false;
          return;
        }
        brand.coupons.push(coupon);
      }
      else{//unchecked
        brand.coupons = _.filter(brand.coupons,function(coupon_t){
          return coupon_t != coupon;
        })
      }
    }
    function showProductCoupon(products,coupon){
      if(!isNumberInvalid(coupon.Coupon.product_list)){
        for(var product in products){
          for(var coupon_pid_index in coupon.Coupon.product_list){
            if(coupon.Coupon.product_list[coupon_pid_index] == products[product].pid){
              return true;
            }
          }
        }
        return false;
      }
      return false;
    }
    function setSiteCoupon(coupon){
      if(vm.siteCoupon != null){
        vm.siteCoupon.isChecked = false;
      }
      vm.siteCoupon = coupon;
    }
    function isNumberInvalid(num){
      if(num == null || num == 0){
        return true;
      }
      else{
        return false;
      }
    }
    function isSiteCoupons(coupon){
      return isNumberInvalid(coupon.Coupon.brand_id) && isNumberInvalid(coupon.Coupon.product_list) && isNumberInvalid(coupon.Coupon.category_id);
    }

    function getBrandById(id){
      return _.find(vm.brands, function(brand){return brand.Brand.id == id});
    }
    function getPriceOfProduct(product){
      return product.price * product.num;
    }
    function getPriceOfBrand(brandItem){
      return _.reduce(brandItem.items, function(memo, product){return memo + vm.getPriceOfProduct(product)}, 0)
       + vm.getShipFeeOfBrand(brandItem.id);
    }
    function getShipFeeOfBrand(brandId){
      return Math.max(_.find(vm.shipFees, function(fee, bid){return bid == brandId}), 0);
    }
    function countOfProducts(brandItem){
      return _.size(brandItem.items);
    }
    function changeAddress(){
      $state.go('addresses',{state:1});
    }
    function confirmCouponCode(){
      vm.couponCode = vm.couponCodeTemp;
    }
    function getPidList(){
      return _.flatten(_.map(vm.confirmedBrandItems, function(br){return _.map(br.items, function(i){return i.pid})}));
    }
    function readyToSubmitOrder(){
      if(_.isEmpty(vm.defaultAddress)){
        return false;
      }
      if(_.isEmpty(vm.confirmedBrandItems)){
        return false;
      }
      return true;
    }
    function submitOrder(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      var usedCoupons = _.filter(vm.validCoupons,function(coupon){
        return coupon.isChecked == true;
      })

      var remarks = {};
      _.each(vm.confirmedBrandItems, function(brandItem){
        remarks[brandItem.id] = brandItem.remark;
      });
      Orders.submitOrder(vm.getPidList(), vm.defaultAddress.OrderConsignees.id, vm.couponCode, remarks, $rootScope.user.token.access_token).then(function(orderIds){
        $log.log("submit order successfully: ").log(orderIds);
        $rootScope.reloadOrders($rootScope.user.token.access_token);
        $rootScope.reloadCart($rootScope.user.token.access_token);
        $ionicHistory.currentView($ionicHistory.backView());
        if(orderIds.length > 1){
          $state.go("orders", {state: 0});
        }
        else{
          $state.go("order-detail", {id: orderIds[0]});
        }
      }, function(e){
        $log.log("submit order failed: ").log(e);
        $rootScope.alertMessage('提交订单失败，请重试');
      });
    }
  }
})(window, window.angular);