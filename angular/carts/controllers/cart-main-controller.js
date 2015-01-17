(function (window, angular) {
  "use strict";

  angular.module('module.cart')
  .controller('CartMainCtrl', CartMainCtrl)

  function CartMainCtrl($state,$q,$log,$scope,$rootScope,Carts,Addresses,Orders,Users){
    var vm = this;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.deleteCartItem = deleteCartItem;
    vm.confirmCartInfo = confirmCartInfo;
    vm.watchCartItems = watchCartItems;
    vm.getCartItemsOfBrand = getCartItemsOfBrand;
    vm.toggleCartItem = toggleCartItem;
    vm.getTotalPrice = getTotalPrice;
    vm.cancelProductDelete = cancelProductDelete;
    vm.checkAllCartItems = checkAllCartItems;
    vm.uncheckAllCartItems = uncheckAllCartItems;
    vm.getCheckedNumber = getCheckedNumber;
    vm.goShop = goShop;
    vm.isShowLogin = isShowLogin;
    vm.goLogin = goLogin;
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
    function isShowLogin(){
      return !_.isEmpty($rootScope.user.user);
    }
    function goLogin(){
      $state.go("app.cart-account-login");
    }
    function goShop(){
      $state.go('app.home');
    }
    function getCheckedNumber(){
      var t = (_.countBy($rootScope.cart.cartItems,function(item){
        return item['checked'];
      }))['true'];
      if(t == null)
        return 0;
      else
        return t;

    }
    function checkAllCartItems(){
      _.each($rootScope.cart.cartItems,function(cartItem){
        cartItem['checked'] = true;
      })
    }
    function uncheckAllCartItems(){
      _.each($rootScope.cart.cartItems,function(cartItem){
        cartItem['checked'] = false;
      })
    }
    function cancelProductDelete(){
      _.map(vm.cartItems,function(cartItem){
        cartItem['deleteMode'] = false;
      })
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
    function confirmCartInfo(){
      if(!_.isEmpty($rootScope.cart.defaultAddress)){
        $state.go('app.cart-order-info');        
      }      

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
      return _.filter($rootScope.cart.cartItems,function(cartItem){return cartItem.Cart.brand_id == id})
    }
  }
})(window, window.angular);