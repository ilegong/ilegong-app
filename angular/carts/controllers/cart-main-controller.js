(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartMainCtrl', CartMainCtrl)
  function CartMainCtrl($state,$q,$log,$scope,$rootScope,Carts,Addresses,Orders,Users){
    var vm = this;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.deleteCartItem = deleteCartItem;
    vm.readyToConfirm = function(){return _.any(vm.cartItems, function(cartItem){return cartItem.checked})};
    vm.confirmCart = confirmCart;
    vm.getCartItemsOfBrand = getCartItemsOfBrand;
    vm.toggleCartItem = toggleCartItem;
    vm.getPriceOfBrand = getPriceOfBrand;
    vm.getTotalPrice = getTotalPrice;
    vm.checkAllCartItems = function(){_.each($rootScope.cart.cartItems,function(cartItem){cartItem.checked = true;})};
    vm.uncheckAllCartItems = function(){_.each($rootScope.cart.cartItems,function(cartItem){cartItem.checked = false;})};;
    vm.getCheckedNumber = function(){return _.filter($rootScope.cart.cartItems,function(item){return item.checked;}).length;};
    vm.toLoginPage = function(){$state.go('app.cart-account-login')}; vm.toHomePage = function(){$state.go('app.home');};
    vm.brandChecked = function(id) {return _.all(vm.getCartItemsOfBrand(id),function(cartItem){return cartItem.checked;});};
    vm.toggleBrand = toggleBrand;
    vm.doRefresh = doRefresh;
    activate();

    function activate(){
      vm.isLoggedIn = !_.isEmpty($rootScope.user.token);
      vm.cartItems = $rootScope.cart.cartItems;
      vm.brands = $rootScope.cart.brands;
      $scope.$watch('cart.cartItems', function(newCartItems, oldCartItems) {
        vm.cartItems = _.map(newCartItems, function(cartItem){cartItem.editMode = false; return cartItem});
      });
      $scope.$watch('cart.brands', function(newBrands, oldBrands) {
        vm.brands = newBrands;
      });
      $scope.$watch('user.token',function(newToken,oldToken){
        vm.isLoggedIn = !_.isEmpty(newToken);
      });
    }
    
    function doRefresh(){
      Carts.getCartItems($rootScope.user.token.access_token).then(function(result){
        $rootScope.updateCart(result);
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
    
    function toggleBrand(brandId){
      if(!vm.brandChecked(brandId)){
        _.each(vm.getCartItemsOfBrand(brandId),function(cartItem){
          cartItem['checked'] = true;
        });
      }
      else{
        _.each(vm.getCartItemsOfBrand(brandId),function(cartItem){
          cartItem['checked'] = false;
        });
      }
    }
    function toggleCartItem(product,e){
      product['checked'] = !product['checked'];
      
    }
    function getPriceOfBrand(brandId){
      var checkedCartItems = _.filter(vm.getCartItemsOfBrand(brandId), function(cartItem){return cartItem.checked});
      return _.reduce(checkedCartItems, function(memo, cartItem){
        return memo + cartItem.Cart.price * cartItem.Cart.num;
      }, 0);
    }
    function getTotalPrice(){
      return _.reduce(vm.brands, function(memo, brand){
          return memo + vm.getPriceOfBrand(brand.Brand.id);
      }, 0);
    }
    function reduceCartItemNum(cart) {
      if(!$rootScope.user.loggedIn){
        return $state.go('app.my-account-login');
      }
      var originalNum = cart.num;
      cart.num = Math.max(cart.num - 1, 0);
      Carts.editNum(cart.id,cart.num, $rootScope.user.token.access_token).then(function(result){}, function(e){
        cart.num = originalNum;
      });
    };
    function addCartItemNum(cart){
      if(!$rootScope.user.loggedIn){
        return $state.go('app.my-account-login');
      }
      var original = cart.num;
      cart.num=Number(cart.num) +1;
      Carts.editNum(cart.id,cart.num, $rootScope.user.token.access_token).then(function(result){}, function(e){
        cart.num = original;
      });
    };
    function deleteCartItem(cartItem){
      if(!$rootScope.user.loggedIn){
        return $state.go('app.my-account-login');
      }
      Carts.deleteCartItem(cartItem.Cart.id, $rootScope.user.token.access_token).then(function(result){
        $rootScope.cart.cartItems = _.filter($rootScope.cart.cartItems, function(cartItemm){return cartItemm.Cart.id != cartItem.Cart.id});
      }, function(e){$log.log("delete cart item failed: ").log(e)});
    }
    function getCartItemsOfBrand(id){
      return _.filter($rootScope.cart.cartItems,function(cartItem){return cartItem.Cart.brand_id == id})
    }
    function confirmCart(){
      if(vm.isLoggedIn){
        $state.go('app.cart-confirmation');
      }
      else{
        vm.toLoginPage();
      }
    }
  }
})(window, window.angular);