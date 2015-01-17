(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartInfoCtrl', CartInfoCtrl)

  function CartInfoCtrl($q,$ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders, Carts){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.getBrandById = getBrandById;
    vm.confirmCouponCode = confirmCouponCode;
    vm.submitOrder = submitOrder;
    vm.addAddress = addAddress;

    vm.setAddress = setAddress;
    activate();

    function activate(){
      vm.cart = $rootScope.cart;
      vm.cartItems = $rootScope.cart.cartItems;
      vm.defaultAddress = $rootScope.cart.defaultAddress;
      vm.couponCode = $rootScope.cart.couponCode;
      Addresses.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      vm.brands = $rootScope.cart.brands;
      vm.pidList = _.map(_.filter(vm.cartItems, function(ci){return ci.checked}), function(ci){return ci.Cart.product_id});
      
      Carts.getCartInfo(vm.pidList, vm.defaultAddress.OrderConsignees.id, vm.couponCode).then(function(result){
        console.log('asdasd');
        console.log(result);
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
      })
    }
    function setAddress(addr){
      $rootScope.cart['setAddressDefer'] = $q.defer();
      $rootScope.cart['setAddressDefer'].promise.then(function(addr){
        $log.log(addr);
        $rootScope.cart['defaultAddress'] = addr;
        activate();
      })
      console.log($rootScope.cart);
      $state.go('app.order-addresses-info',{state:1,addrId:addr.OrderConsignees.id});
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
      Orders.submitOrder(vm.pidList, vm.defaultAddress.OrderConsignees.id,vm.couponCode,remarks).then(function(orderId){
        $log.log("submit order successfully: ").log(orderId);
        $state.go("app.cart-orders.total");
      }, function(e){
        $log.log("submit order failed: ").log(e);
      });
    }
    function addAddress(){
      Addresses.add(vm.newAddr_name, vm.newAddr_address, vm.provinceModel.id,vm.cityModel.id,vm.countyModel.id,vm.newAddr_mobilephone).then(function(address){
        $rootScope.cart.defaultAddress = address;
      })
    }
  }
})(window, window.angular);