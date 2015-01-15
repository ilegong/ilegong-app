(function (window, angular) {
  "use strict";

  angular.module('ilegong.cart', ['app.services','ionic'])
  .controller('ShoppingCartsCtrl',ShoppingCartsCtrl)
  .controller('OrderInfoCtrl',OrderInfoCtrl)

  function ShoppingCartsCtrl($state,$q,$log,$scope,$rootScope,Carts,Addresses,Orders){
    var vm = this;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.deleteCartItem = deleteCartItem;
    vm.confirmCartInfo = confirmCartInfo;
    vm.watchCartItems = watchCartItems;
    vm.getCartItemsOfBrand = getCartItemsOfBrand;
    vm.toggleCartItem = toggleCartItem;
    vm.getTotalPrice = getTotalPrice;
    activate();

    function activate(){
      vm.editMode = false;
      vm.cartItems = $rootScope.cart.cartItems;
      vm.brands = $rootScope.cart.brands;
      Carts.getCartItems().then(function(result){
        $rootScope.updateCart(result);
      })
      Addresses.getDefaultAddress().then(function(defaultAddress){
        $rootScope.cart.defaultAddress = defaultAddress;
      });
      vm.watchCartItems();
    }
    function toggleCartItem(editMode,product){
      if(editMode){
        product['deleteMode'] = !product['deleteMode'];
      }
      else{
        product['checked'] = !product['checked'];
      }
    }
    function getTotalPrice(){
      return _.reduce(_.filter(vm.cartItems, function(cartItem){return cartItem.checked}), function(memo, cartItem){
          return memo + cartItem.Cart.price * cartItem.Cart.num;
      }, 0);
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
    function deleteCartItem(id){
      Carts.deleteCartItem(id).then(function(result){
        $rootScope.cart.cartItems = _.filter($rootScope.cart.cartItems, function(cartItem){return cartItem.Cart.id != id});
      }, function(e){$log.log("delete cart item failed: ").log(e)});
    }
    function confirmCartInfo(){      
      var pids = _.map(vm.cartItems, function(cart){return Number(cart.Cart.product_id)});
      $rootScope.cart.pidList = pids;
      $state.go('app.cart-order-info');
    }
    function watchCartItems(){
      $scope.$watch('cart.cartItems', function(newCartItems, oldCartItems) {
        vm.cartItems = newCartItems;
      });
      $scope.$watch('cart.brands', function(newBrands, oldBrands) {
        vm.brands = newBrands;
      });
    }
    function getCartItemsOfBrand(id){
      return _.filter(vm.cartItems,function(cartItem){return cartItem.Cart.brand_id == id})
    }
  }

  function OrderInfoCtrl($q,$ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders, Carts){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.getBrandById = getBrandById;
    vm.confirmCouponCode = confirmCouponCode;
    vm.submitOrder = submitOrder;
    vm.addAddress = addAddress;
    vm.getCounties = getCounties;
    vm.getCities = getCities;
    vm.getTotalShipFees = getTotalShipFees;
    vm.setAddress = setAddress;
    activate();

    function activate(){
      vm.cart = $rootScope.cart;
      vm.cartItems = $rootScope.cart.cartItems;
      vm.defaultAddress = $rootScope.cart.defaultAddress;
      vm.couponCode = $rootScope.cart.couponCode;
      Orders.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      vm.brands = $rootScope.cart.brands;
      vm.pidList = _.map(_.filter(vm.cartItems, function(ci){return ci.checked}), function(ci){return ci.Cart.product_id});
      Carts.getCartInfo(vm.pidList, vm.defaultAddress.OrderConsignees.id, vm.couponCode).then(function(result){
        vm.brands = result.brands; 
        
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
        $state.go("app.cart-order-detail", {id: orderId});
      }, function(e){
        $log.log("submit order failed: ").log(e);
      });
    }
    function getTotalShipFees(){
      var t = 0;
      if(vm.cart==null)
        return 0;
      for(var i in vm.cart.shipFees){
        t+=vm.cart.shipFees[i];
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
        $rootScope.cart.defaultAddress = address;
      })
    }
  }
})(window, window.angular);