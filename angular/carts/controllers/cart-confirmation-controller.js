(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartConfirmationCtrl', CartConfirmationCtrl)

  function CartConfirmationCtrl($q,$ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders, Carts){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.getBrandById = getBrandById;
    vm.confirmCouponCode = confirmCouponCode;
    vm.submitOrder = submitOrder;
    activate();

    function activate(){
      vm.cart = $rootScope.cart;
      vm.cartItems = $rootScope.cart.cartItems;
      vm.currentAddress = $rootScope.address.currentAddress;
      $log.log("current address is: ").log(vm.currentAddress);
      vm.couponCode = $rootScope.cart.couponCode;
      Addresses.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      vm.brands = $rootScope.cart.brands;
      vm.pidList = _.map(_.filter(vm.cartItems, function(ci){return ci.checked}), function(ci){return ci.Cart.product_id});
      
      Carts.getCartInfo(vm.pidList, vm.currentAddress.OrderConsignees.id, vm.couponCode).then(function(result){
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
      $scope.$watch("address.currentAddress", function(newAddress, oldAddress){
        vm.currentAddress = newAddress;
      })
    }
    function getBrandById(id){
      return _.find(vm.brands, function(brand){return brand.Brand.id == id});
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
      Orders.submitOrder(vm.pidList, vm.currentAddress.OrderConsignees.id,vm.couponCode,remarks).then(function(orderId){
        $log.log("submit order successfully: ").log(orderId);
        $state.go("app.cart-orders.total");
      }, function(e){
        $log.log("submit order failed: ").log(e);
      });
    }
  }
})(window, window.angular);