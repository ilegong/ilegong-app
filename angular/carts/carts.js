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
      $rootScope.cart = $rootScope.cart || {carts:[],brands:[],defaultAddress:{}}
      vm.cartItems = $rootScope.cart.cartItems || [];
      Carts.getCartItems().then(function(result){
        vm.cartItems = _.map(result.carts, function(cartItem){cartItem.checked = true; return cartItem;});
        vm.brands = result.brands || [];
        $rootScope.cart.cartItems = vm.cartItems;
        $rootScope.cart.brands = vm.brands;
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
      if(_.isEmpty(vm.cartItems))
        return 0;
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
      $log.log("confirm cart info for pids: ").log(pids);
      $state.go('app.cart-order-info');
    }
    function watchCartItems(){
      $scope.$watch('cartInfo.cartItems', function(newCartItems, oldCartItems) {
        vm.cartItems = newCartItems;
      });
    }
    function getCartItemsOfBrand(id){
      return _.filter(vm.cartItems,function(cartItem){return cartItem.Cart.brand_id == id})
    }
  }

  function OrderInfoCtrl($q,$ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders, Carts){
    var vm = this;
    vm.goBack = function(){$ionicHistory.goBack();}
    vm.loadBrandById = loadBrandById;
    vm.confirmCoupon_code = confirmCoupon_code;
    vm.submitOrder = submitOrder;
    vm.addAddress = addAddress;
    vm.getCounties = getCounties;
    vm.getCities = getCities;
    vm.getTotalShipFees = getTotalShipFees;
    vm.setAddress = setAddress;
    activate();

    function activate(){
      vm.cart = $rootScope.cart;
      vm.defaultAddress = vm.cart.defaultAddress;
      Orders.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      Carts.getCartInfo(vm.cart.pidList, vm.cart.defaultAddress.OrderConsignees.id, vm.cart.couponCode).then(function(result){
        vm.cart.brands = result.brands; 
        vm.cart.pidList = _.flatten(_.map(result.cart.brandItems, function(br){return _.map(br.items, function(i){return i.pid})}));
        if(_.isEmpty(vm.cart.pidList)){
          $log.log("get cart info successfully:").log(result.cart.brandItems).log(vm.cart.pidList);
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
      console.log('asdad');
      console.log($rootScope.cart);
      $state.go('app.order-addresses-info',{state:1,addrId:addr.OrderConsignees.id});
    }
    function loadBrandById(id){
      return _.find(vm.cart.brands, function(brand){return brand.Brand.id == id});
    }
    function confirmCoupon_code(){
      vm.coupon_code = vm.coupon_code_t;
    }
    function submitOrder(){
      var pid_list = vm.cart.pidList;
      var remarks = {};
      _.each(vm.cart.brands, function(brand){
        remarks[brand.Brand.id] = brand.Brand.remark;
      });
      $log.log("submit order for products " + vm.cart.pidList);
      Orders.submitOrder(vm.cart.pidList, vm.defaultAddress.OrderConsignees.id,vm.coupon_code,remarks).then(function(orderId){
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