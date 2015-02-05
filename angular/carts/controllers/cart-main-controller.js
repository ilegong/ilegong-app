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
    vm.readyToConfirm = function(){return _.any(vm.cartItems, function(cartItem){return cartItem.checked})};
    vm.confirmCart = confirmCart;
    vm.getCartItemsOfBrand = getCartItemsOfBrand;
    vm.toggleCartItem = toggleCartItem;
    vm.getPriceOfBrand = getPriceOfBrand;
    vm.getTotalPrice = getTotalPrice;
    vm.checkAllCartItems = function(){_.each($rootScope.user.cartItems,function(cartItem){cartItem.checked = true;})};
    vm.uncheckAllCartItems = function(){_.each($rootScope.user.cartItems,function(cartItem){cartItem.checked = false;})};;
    vm.getCheckedNumber = function(){return _.filter($rootScope.user.cartItems,function(item){return item.checked;}).length;};
    vm.brandChecked = function(id) {return _.all(vm.getCartItemsOfBrand(id),function(cartItem){return cartItem.checked;});};
    vm.toggleBrand = toggleBrand;
    vm.getBrandsOfCartItems = getBrandsOfCartItems;
    vm.toBrandPage = function(brand){$state.go("store.home", {storeId: brand.Brand.id, name: brand.Brand.name})};
    vm.toProductPage = function(cartItem){if(cartItem.editMode){return;}; $state.go("product-detail.intro", {id: cartItem.Cart.product_id, from:-3})};
    vm.doRefresh = doRefresh;
    activate();

    function activate(){
      vm.isLoggedIn = !_.isEmpty($rootScope.user.token);
      vm.cartItems = $rootScope.user.cartItems;
      vm.brands = vm.getBrandsOfCartItems(vm.cartItems);
      $scope.$watch('user.cartItems', function(newCartItems, oldCartItems) {
        vm.cartItems = _.map(newCartItems, function(cartItem){cartItem.editMode = false; return cartItem});
        vm.brands = vm.getBrandsOfCartItems(vm.cartItems);
      });
      $scope.$watch('user.token',function(newToken,oldToken){
        vm.isLoggedIn = !_.isEmpty(newToken);
      });
    }
    
    function doRefresh(){
      $rootScope.reloadCart();
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
    function toggleCartItem(product){
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
    function getBrandsOfCartItems(cartItems){
      var brandIds = _.map(cartItems, function(cartItem){return cartItem.Cart.brand_id});
      return _.filter($rootScope.brands, function(brand){return _.contains(brandIds, brand.Brand.id)});
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
        $rootScope.user.cartItems = _.filter($rootScope.user.cartItems, function(cartItemm){return cartItemm.Cart.id != cartItem.Cart.id});
      }, function(e){$log.log("delete cart item failed: ").log(e)});
    }
    function getCartItemsOfBrand(id){
      return _.filter($rootScope.user.cartItems,function(cartItem){return cartItem.Cart.brand_id == id})
    }
    function confirmCart(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      $state.go('app.cart-confirmation');
    }
  }
})(window, window.angular);