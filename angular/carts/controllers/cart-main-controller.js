(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartMainCtrl', CartMainCtrl)
  function CartMainCtrl($state,$q,$log,$scope,$rootScope,Carts,Addresses,Orders,Users){
    var vm = this;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.deleteCartItem = deleteCartItem;
    vm.readyToConfirm = function(){return _.any(vm.cartBrands, function(brand){return _.any(brand.cartItems, function(ci){return ci.checked})})};
    vm.confirmCart = confirmCart;
    vm.onConfirmCartFailed = onConfirmCartFailed;
    vm.toggleCartItem = function(cartItem){cartItem['checked'] = !cartItem['checked'];};
    vm.getPriceOfBrand = getPriceOfBrand;
    vm.getTotalPrice = getTotalPrice;
    vm.checkAllBrands = function(){_.each(vm.cartBrands,function(brand){_.each(brand.cartItems, function(ci){ci.checked = true})})};
    vm.uncheckAllBrands = function(){_.each(vm.cartBrands,function(brand){_.each(brand.cartItems, function(ci){ci.checked = false})})};
    vm.isBrandChecked = function(brand) {return _.all(brand.cartItems, function(cartItem){return cartItem.checked;});};
    vm.allBrandsChecked = function() {return _.all(vm.cartBrands,function(brand){return vm.isBrandChecked(brand)})};
    vm.toggleBrand = toggleBrand;
    vm.toProductPage = function(cartItem){$state.go("product-detail", {id: cartItem.Cart.product_id, type:1, value: cartItem.Cart.product_id})};
    vm.doRefresh = doRefresh;
    activate();

    function activate(){
      vm.isLoggedIn = !_.isEmpty($rootScope.user.token);
      vm.cartBrands = $rootScope.user.cartBrands;
      $scope.$watch('user.cartBrands', function(newCartBrands, oldCartBrands) {
        vm.cartBrands = $rootScope.user.cartBrands;
      });
      $scope.$watch('user.token',function(newToken,oldToken){
        vm.isLoggedIn = !_.isEmpty(newToken);
      });
    }

    function doRefresh(){
      $rootScope.reloadCart($rootScope.user.token.access_token).then(function(){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      }, function(){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      })
    }
    function toggleBrand(brand){
      var isBrandChecked = vm.isBrandChecked(brand);
      _.each(brand.cartItems, function(cartItem){
        cartItem['checked'] = !isBrandChecked;
      });
    }
    function getPriceOfBrand(brand){
      var checkedCartItems = _.filter(brand.cartItems, function(cartItem){return cartItem.checked});
      return _.reduce(checkedCartItems, function(memo, cartItem){
        return memo + cartItem.Cart.price * cartItem.Cart.num;
      }, 0);
    }
    function getTotalPrice(){
      return _.reduce(vm.cartBrands, function(memo, brand){
          return memo + vm.getPriceOfBrand(brand);
      }, 0);
    }
    function reduceCartItemNum(cart) {
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      var originalNum = cart.num;
      cart.num = Math.max(cart.num - 1, 0);
      Carts.editNum(cart.id,cart.num, $rootScope.user.token.access_token).then(function(result){}, function(e){
        cart.num = originalNum;
      });
    };
    function addCartItemNum(cart){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      var original = cart.num;
      cart.num = Math.min(Number(cart.num) +1, 9999);
      Carts.editNum(cart.id,cart.num, $rootScope.user.token.access_token).then(function(result){}, function(e){
        cart.num = original;
      });
    };
    function deleteCartItem(cartItem){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      Carts.deleteCartItem(cartItem.Cart.id, $rootScope.user.token.access_token).then(function(result){
        $rootScope.reloadCart($rootScope.user.token.access_token);
      }, function(e){$log.log("delete cart item failed: ").log(e)});
    }
    function confirmCart(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      var couponCode = '';
      var pidList = _.flatten(_.map(vm.cartBrands, function(brand){return _.map(_.filter(brand.cartItems, function(ci){return ci.checked}), function(ci){return ci.Cart.id})}));
      if(_.isEmpty(pidList)) {
        return $rootScope.reloadCart($rootScope.user.token.access_token).then(function(){
          if(_.isEmpty($rootScope.user.cartBrands)){
            $rootScope.alertMessage('购物车为空');            
          }
          else{
            $rootScope.alertMessage('抱歉，操作失败，请重新结算');
          }
        }, function(){
          $rootScope.alertMessage('结算失败，请稍后重试');
        });
      }

      $rootScope.confirmCart(pidList, couponCode, $rootScope.user.token.access_token).then(function(result){
        $state.go('cart-confirmation', 1);
      }, function(e){
        var message = '结算失败，请稍后重试';
        if(e.status == 0){
          message = '网络连接不可用，请稍后重试';
        }
        else if(e.reason == 'invalid_address'){
          message = '请设置默认收货地址'
        }

        vm.onConfirmCartFailed(message, e);
      });
    }
    function onConfirmCartFailed(message){
      $rootScope.alertMessage(message);
      $rootScope.reloadCart($rootScope.user.token.access_token);
    }
  }
})(window, window.angular);