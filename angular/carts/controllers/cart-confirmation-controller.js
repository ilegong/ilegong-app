(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartConfirmationCtrl', CartConfirmationCtrl)

  function CartConfirmationCtrl($q,$ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders, Carts){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.getPriceOfProduct = getPriceOfProduct;
    vm.getPriceOfBrand = getPriceOfBrand;
    vm.getShipFeeOfBrand = getShipFeeOfBrand;
    vm.changeAddress = changeAddress;
    vm.getBrandById = getBrandById;
    vm.confirmCouponCode = confirmCouponCode;
    vm.submitOrder = submitOrder;
    activate();

    function activate(){
      vm.cart = $rootScope.cart;
      vm.cartItems = $rootScope.cart.cartItems;
      
      vm.couponCode = $rootScope.cart.couponCode;
      Addresses.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      vm.brands = $rootScope.cart.brands;
      vm.pidList = _.map(_.filter(vm.cartItems, function(ci){return ci.checked}), function(ci){return ci.Cart.product_id});
      vm.defaultAddress = $rootScope.getDefaultAddress();
      
      Carts.getCartInfo(vm.pidList, vm.defaultAddress.OrderConsignees.id, vm.couponCode).then(function(result){
        $log.log("get cart info successfully: ").log(result);
        vm.brands = result.brands;
        vm.shipFees = result.shipFees; 
        vm.totalShipFees = _.reduce(vm.shipFees, function(memo, shipFee){return memo + shipFee}, 0);
        vm.reduced = result.reduced;
        vm.totalPrice = result.total_price;
        vm.cart = result.cart;
        vm.pidList = _.flatten(_.map(result.cart.brandItems, function(br){return _.map(br.items, function(i){return i.pid})}));
        if(_.isEmpty(vm.cart.pidList)){
          $log.log("get empty pid list when confirm cart info:").log(result.cart.brandItems);
        }
      });
      $scope.$watch("addresses", function(newAddress, oldAddress){
        vm.defaultAddress = $rootScope.getDefaultAddress();
      })
    }
    function getBrandById(id){
      return _.find(vm.brands, function(brand){return brand.Brand.id == id});
    }
    function getPriceOfProduct(product){
      return product.price * product.num;
    }
    function getPriceOfBrand(brandItem){
      return _.reduce(brandItem.items, function(memo, product){return memo + vm.getPriceOfProduct(product)}, 0);
    }
    function getShipFeeOfBrand(brandId){
      var fee =  _.find(vm.shipFees, function(fee, bid){return bid == brandId});
      return fee;
    }
    function changeAddress(){
      $state.go('app.order-addresses',{state:1});
    }
    function confirmCouponCode(){
      vm.couponCode = vm.couponCodeTemp;
    }
    function submitOrder(){
      var remarks = {};
      _.each(vm.brands, function(brand){
        remarks[brand.Brand.id] = brand.Brand.remark;
      });
      $log.log("submit order for products " + vm.pidList);
      Orders.submitOrder(vm.pidList, vm.defaultAddress.OrderConsignees.id,vm.couponCode,remarks).then(function(orderId){
        $log.log("submit order successfully: ").log(orderId);
        $state.go("app.cart-orders", {state: 0});
      }, function(e){
        $log.log("submit order failed: ").log(e);
      });
    }
  }
})(window, window.angular);