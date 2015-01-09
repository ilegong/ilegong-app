(function (window, angular) {
  "use strict";

  angular.module('ilegong.carts', ['app.services','ionic'])
  .controller('ShoppingCartsCtrl',ShoppingCartsCtrl)
  .controller('OrderInfoCtrl',OrderInfoCtrl)

  function ShoppingCartsCtrl($state,$q,$log,$scope,$rootScope,Carts,Addresses,Orders){
    var vm = this;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.getTotallPrice = getTotallPrice;
    vm.deleteCartItem = deleteCartItem;
    vm.confirmCartInfo = confirmCartInfo;
    activate();

    function activate(){
      $rootScope.cartInfo = $rootScope.cartInfo || {}
      vm.cartItems = $rootScope.cartInfo.cartItems || [];
      Carts.getCartItems().then(function(result){
        vm.cartItems = result.carts || [];
        vm.total_price = vm.getTotallPrice();
      })
      Addresses.getDefaultAddress().then(function(defaultAddress){
        $rootScope.cartInfo.defaultAddress = defaultAddress;
      });
    }
    function reduceCartItemNum(cart) {
      var originalNum = cart.num;
      cart.num = Math.max(cart.num - 1, 0);
      Carts.editNum(cart.id,cart.num).then(function(result){}, function(e){
        cart.num = originalNum;
      });
    };
    function addCartItemNum(cart){
      var original = cart.num;
      cart.num=Number(cart.num) +1;
      Carts.editNum(cart.id,cart.num).then(function(result){}, function(e){
        cart.num = original;
      });
    };
    function getTotallPrice(){
      return _.reduce(vm.cartItems, function(memo, cart){ return memo + cart.Cart.price * cart.Cart.num; }, 0);
    };
    function deleteCartItem(id){
      Carts.deleteCartItem(id).then(function(result){
        var cartItem = _.filter(vm.cartItems, function(cartItem){return cartItem.id == id});
        vm.cartItems.splice(vm.cartItems.indexOf(cartItem), 1);
      }, function(e){});
    }
    function confirmCartInfo(){      
      var pids = _.map(vm.cartItems, function(cart){return Number(cart.Cart.product_id)});
      $rootScope.cartInfo.pidList = pids;
      $state.go('app.order-info');
    }
  }

//_.find(array,function (e){return e.status == 1})
//_.map(array,function(e,index){})
  function OrderInfoCtrl($ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders, Carts){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.loadBrandById = loadBrandById;
    vm.confirmCoupon_code = confirmCoupon_code;
    vm.submitOrder = submitOrder;
    vm.addAddress = addAddress;
    vm.getCounties = getCounties;
    vm.getCities = getCities;
    vm.getTotalShipFees = getTotalShipFees;
    activate();

    function activate(){
      vm.cartInfo = $rootScope.cartInfo;
      vm.defaultAddress = vm.cartInfo.defaultAddress;
      Orders.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      Carts.getCartInfo(vm.cartInfo.pidList, vm.cartInfo.defaultAddress.OrderConsignees.id, vm.cartInfo.couponCode).then(function(cartInfo){
        vm.cartInfo = cartInfo;
      })
    }
    function loadBrandById(id){
      return _.find(vm.cartInfo.brands, function(brand){return brand.Brand.id == id});
    }
    function confirmCoupon_code(){
      vm.coupon_code = vm.coupon_code_t;
    }
    function submitOrder(){
      var pid_list = _.flatten(_.map(vm.cartInfo.brandItems, function(bi){return _.map(bi.items, function(i){return i.pid})}))
      var remarks = {};
      _.each(vm.cartInfo.brands, function(brand){
        remarks[brand.Brand.id] = brand.Brand.remark;
      });
      $log.log("submit order for products ").log(pid_list).log(", with remarks ").log(remarks);
      Orders.submitOrder(pid_list, vm.defaultAddress.OrderConsignees.id,vm.coupon_code,remarks).then(function(orderId){
        $log.log("submit order successfully: ").log(orderId);
        $state.go("app.my-order-detail", {id: orderId});
      }, function(e){
        $log.log("submit order failed: ").log(e);
      });
    }
    function getTotalShipFees(){
      var t = 0;
      if(vm.cartInfo==null)
        return 0;
      for(var i in vm.cartInfo.shipFees){
        t+=vm.cartInfo.shipFees[i];
      }
      return t;
    }
    function getCities(id){
      if(id==null){
        vm.cities = null;
        vm.counties = null;
        return;
      }
      vm.cities = $rootScope.getCities(id);
    }
    function getCounties(id){
      if(id == null){
        vm.counties = null;
        return;
      }
      vm.counties = $rootScope.getCounties(id);
    }
    function addAddress(){
      Addresses.add(vm.newAddr_name,vm.newAddr_address,vm.provinceModel.id,vm.cityModel.id,vm.countyModel.id,vm.newAddr_mobilephone).then(function(address){
        $rootScope.cartInfo.defaultAddress = address;
      })
    }
  }
})(window, window.angular);