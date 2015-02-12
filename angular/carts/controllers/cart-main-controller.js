(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartMainCtrl', CartMainCtrl)
  function CartMainCtrl($state,$q,$log,$scope,$rootScope,Carts,Addresses,Orders,Users){
    var vm = this;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.clickSaveOrEditBtn = clickSaveOrEditBtn;
    vm.deleteCartItem = deleteCartItem;
    vm.readyToConfirm = function(){return _.any(vm.cartBrands, function(brand){return _.any(brand.cartItems, function(ci){return ci.checked})})};
    vm.confirmCart = confirmCart;
    vm.toggleCartItem = function(cartItem){cartItem['checked'] = !cartItem['checked'];};
    vm.getPriceOfBrand = getPriceOfBrand;
    vm.getTotalPrice = getTotalPrice;
    vm.checkAllBrands = function(){_.each(vm.cartBrands,function(brand){_.each(brand.cartItems, function(ci){ci.checked = true})})};
    vm.uncheckAllBrands = function(){_.each(vm.cartBrands,function(brand){_.each(brand.cartItems, function(ci){ci.checked = false})})};
    vm.getCheckedNumber = getCheckedNumber;
    vm.isBrandChecked = function(brand) {return _.all(brand.cartItems, function(cartItem){return cartItem.checked;});};
    vm.allBrandsChecked = function() {return _.all(vm.cartBrands,function(brand){return vm.isBrandChecked(brand)})};
    vm.toggleBrand = toggleBrand;
    vm.toProductPage = function(cartItem){if(cartItem.editMode){return;}; $state.go("product-detail.intro", {id: cartItem.Cart.product_id, from:-3})};
    vm.doRefresh = doRefresh;
    activate();

    function activate(){
      vm.isLoggedIn = !_.isEmpty($rootScope.user.token);
      vm.cartBrands = $rootScope.user.cartBrands;
      vm.confirmErrors = {
        'invalid_address': '请设置默认收货地址'
      };
      $scope.$watch('user.cartBrands', function(newCartBrands, oldCartBrands) {
        vm.cartBrands = $rootScope.user.cartBrands;
      });
      $scope.$watch('user.token',function(newToken,oldToken){
        vm.isLoggedIn = !_.isEmpty(newToken);
      });
    }

    function doRefresh(){
      $rootScope.reloadCart($rootScope.user.token.access_token);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
    function getCheckedNumber(){
      return _.reduce(vm.cartBrands, function(memo, brand){
          return memo + _.filter(brand.cartItems, function(ci){return ci.checked}).length;
        }, 0);
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
    function clickSaveOrEditBtn(cartItem){
      cartItem.editMode = !cartItem.editMode;
    }
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
      var pidList = _.flatten(_.map(vm.cartBrands, function(brand){return _.map(brand.cartItems, function(ci){return ci.Cart.product_id})}));
      $rootScope.getCartInfo(pidList, vm.couponCode, $rootScope.user.token.access_token).then(function(){
        $state.go('app.cart-confirmation');
      }, function(e){
        $rootScope.alertMessage(vm.confirmErrors[e.reason] || '结算失败，请重试');
        $ionicHistory.goBack();
      });
    }
  }
})(window, window.angular);