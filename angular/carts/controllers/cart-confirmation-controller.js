(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartConfirmationCtrl', CartConfirmationCtrl)

  function CartConfirmationCtrl($q,$ionicHistory, $log, $scope, $rootScope, $state, $filter, $stateParams, Base, Addresses, Orders, Carts,Coupons, OfflineStores){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.getPriceOfProduct = getPriceOfProduct;
    vm.getPriceOfBrand = getPriceOfBrand;
    vm.getShipFeeOfBrand = getShipFeeOfBrand;
    vm.countOfProducts = countOfProducts;
    vm.changeAddress = changeAddress;
    vm.changeOfflineStore = changeOfflineStore;
    vm.getBrandById = getBrandById;
    vm.confirmCouponCode = confirmCouponCode;
    vm.submitOrder = submitOrder;
    vm.isSiteCoupons = isSiteCoupons;
    vm.setSiteCoupon = setSiteCoupon;
    vm.showProductCoupon = showProductCoupon;
    vm.setBrandOrProductCoupon = setBrandOrProductCoupon;
    vm.getPidList = getPidList;
    vm.readyToSubmitOrder = readyToSubmitOrder;
    vm.init = init;
    activate();

    function activate(){
      vm.type = $stateParams.type;
      vm.isTuanBuying = vm.type == 5;
      vm.isTuanAndSec = _.constant([5,6], vm.type);
      vm.ziti_ship_type = -1;
      vm.provinces = $rootScope.provinces;
      vm.brands = $rootScope.brands;
      vm.offlineStores = $rootScope.offlineStores;
      vm.defaultAddress = $rootScope.getDefaultAddress();
      vm.defaultOfflineStore = $rootScope.getDefaultOfflineStore(vm.ziti_ship_type);
      vm.validCoupons = $rootScope.user.validCoupons;
      vm.invalidCoupons = $rootScope.user.invalidCoupons;

      vm.init();

      $rootScope.$on("addressChanged", function(event, addresses){
        vm.defaultAddress = $rootScope.getDefaultAddress();
      });
      $rootScope.$on("offlineStoreChanged", function(event, addresses){
        vm.defaultOfflineStore = $rootScope.getDefaultOfflineStore(vm.ziti_ship_type);
      });
      $scope.$watch("user.cartInfo", function(){
        vm.init();
      });
    }
    function init(){
      vm.confirmedBrandItems = $rootScope.user.cartInfo.cart.brandItems;
      vm.shippment = $rootScope.user.cartInfo.shippment;

      vm.shipFees = $rootScope.user.cartInfo.shipFees;
      vm.totalShipFees = _.reduce(vm.shipFees, function(memo, shipFee){return memo + shipFee}, 0);
      vm.reduced = $rootScope.user.cartInfo.reduced;
      vm.totalPrice = $rootScope.user.cartInfo.total_price + Math.max($rootScope.user.cartInfo.shipFee, 0);
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
      var shipFee = _.find(vm.shipFees, function(fee, bid){return bid == brandItem.id});
      return _.reduce(brandItem.items, function(memo, product){return memo + vm.getPriceOfProduct(product)}, 0)
       + Math.max(shipFee, 0);
    }
    function getShipFeeOfBrand(brandId){
      var shipFee = _.find(vm.shipFees, function(fee, bid){return bid == brandId});
      if(shipFee == -2){
        return '自提';
      }
      if(shipFee == -1){
        return '货到付款';
      }
      return $filter('currency')(shipFee, '￥')
    }
    function countOfProducts(brandItem){
      return _.size(brandItem.items);
    }
    function changeAddress(){
      $state.go('addresses',{state:1});
    }
    function changeOfflineStore(){
      $state.go('offline-stores');
    }
    function confirmCouponCode(){
      vm.couponCode = vm.couponCodeTemp;
    }
    function getPidList(){
      return _.flatten(_.map(vm.confirmedBrandItems, function(br){return _.map(br.items, function(i){return i.pid})}));
    }
    function readyToSubmitOrder(){
      if(vm.type == 5){
        if(_.isEmpty(vm.offlineStore) || Base.isBlank(vm.username) || !Base.isMobileValid(vm.shippment.mobile)){
          return false;
        }
        if(vm.shippment.needAddressRemark() && Base.isBlank(vm.shippment.detailedAddress)){
          return false;
        }
      }
      else if(_.isEmpty(vm.defaultAddress)){
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
      
      if(!vm.shippment.limitShip){
        var addressId = vm.defaultAddress.OrderConsignees.id;
        var shipPromotionId = -1;
        var detailedAddress = "";
      }
      else{
        var addressId = -1;  
        var shipPromotionId = vm.shippment.pickup.id;
        var detailedAddress = vm.shippment.pickup.address + ' ' + vm.shippment.detailedAddress;
      }
      Orders.submitOrder(vm.getPidList(), addressId, shipPromotionId, vm.shippment.username, vm.shippment.mobile, detailedAddress, vm.couponCode, remarks, $rootScope.user.token.access_token).then(function(orderIds){
        $rootScope.reloadOrders($rootScope.user.token.access_token).finally(function(){
          $rootScope.reloadCart($rootScope.user.token.access_token).finally(function(){
            $ionicHistory.currentView($ionicHistory.backView());
            if(orderIds.length > 1){
              $state.go("orders", {state: 0});
            }
            else{
              $state.go("order-detail", {id: orderIds[0]});
            }
          });
        })
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? '网络连接不可用，请稍后重试': '提交订单失败，请稍后重试');
      });
    }
  }
})(window, window.angular);