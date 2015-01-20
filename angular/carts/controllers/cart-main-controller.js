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
    vm.getTotalPrice = getTotalPrice;
    vm.cancelProductDelete = cancelProductDelete;
    vm.checkAllCartItems = function(){_.each($rootScope.cart.cartItems,function(cartItem){cartItem.checked = true;})};
    vm.uncheckAllCartItems = function(){_.each($rootScope.cart.cartItems,function(cartItem){cartItem.checked = false;})};;
    vm.getCheckedNumber = function(){return _.filter($rootScope.cart.cartItems,function(item){return item.checked;}).length;};
    vm.isLoggedIn = function(){return !_.isEmpty($rootScope.user.token);};
    vm.toLoginPage = function(){$state.go('app.cart-account-login')};
    vm.brandChecked = brandChecked;
    vm.toggleBrand = toggleBrand;
    activate();

    function activate(){
      vm.editMode = false;
      vm.cartItems = $rootScope.cart.cartItems;
      vm.brands = $rootScope.cart.brands;
      Carts.getCartItems().then(function(result){
        $rootScope.updateCart(result);
      })
      Addresses.list().then(function(addresses){
        $rootScope.updateAddresses(addresses);
      });
      $scope.$watch('cart.cartItems', function(newCartItems, oldCartItems) {
        vm.cartItems = newCartItems;
      });
      $scope.$watch('cart.brands', function(newBrands, oldBrands) {
        vm.brands = newBrands;
      });
    }
    function cancelProductDelete(){
      _.map(vm.cartItems,function(cartItem){
        cartItem['deleteMode'] = false;
      })
    }
    function brandChecked(id){
      var t = vm.getCartItemsOfBrand(id);
      return t.length == (_.countBy(t,function(cartItem){
        return cartItem.checked;
      }).true);
    }
    function toggleBrand(editMode,brandId){
      if(!editMode){
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
    }
    function toggleCartItem(editMode,product,e){
      if(editMode){
        product['deleteMode'] = !product['deleteMode'];
        e.stopPropagation();
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
    function deleteCartItem(cartItem){
      Carts.deleteCartItem(cartItem.Cart.id).then(function(result){
        $rootScope.cart.cartItems = _.filter($rootScope.cart.cartItems, function(cartItemm){return cartItemm.Cart.id != cartItem.Cart.id});
      }, function(e){$log.log("delete cart item failed: ").log(e)});
    }
    function getCartItemsOfBrand(id){
      return _.filter($rootScope.cart.cartItems,function(cartItem){return cartItem.Cart.brand_id == id})
    }
    function confirmCart(){
      if(vm.isLoggedIn()){
        $state.go('app.cart-confirmation');
      }
      else{
        vm.toLoginPage();
      }
    }
  }
})(window, window.angular);