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
    vm.carts = [];

    activate();

    function activate(){
      Carts.list().then(function(data){
        vm.total_price = data.total_price || 0;
        vm.carts = data.carts || [];
      })
      $rootScope.cartInfo = $rootScope.cartInfo || {}
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
      return _.reduce(vm.carts, function(memo, cart){ return memo + cart.Cart.price * cart.Cart.num; }, 0);
    };
    function deleteCartItem(id){
      Carts.deleteCartItem(id).then(vm.activate, vm.activate);
    }
    function confirmCartInfo(){      
      var pids = _.map(vm.carts, function(cart){return Number(cart.Cart.product_id)});
      $rootScope.cartInfo.pidList = pids;
      $state.go('app.order-info');
    }
  }

//_.find(array,function (e){return e.status == 1})
//_.map(array,function(e,index){})
  function OrderInfoCtrl($ionicHistory, $log, $scope, $rootScope, $state, Addresses, Orders){
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
      cartRefresh();
    }
    function cartRefresh(){
      Orders.cartInfo(vm.cartInfo.pidList, vm.cartInfo.defaultAddress.OrderConsignees.id,vm.cartInfo.couponCode).then(function(data){
        vm.CartInfo = data.data;
      })
    }
    function loadBrandById(id){
      return _.find(vm.CartInfo.brands, function(brand){return brand.Brand.id == id});
    }
    function confirmCoupon_code(){
      vm.coupon_code = vm.coupon_code_t;
    }
    function submitOrder(){
      var pid_list = Array();
      for(var item in vm.CartInfo.cart.brandItems){
        var t = vm.CartInfo.cart.brandItems[item];
        for(var i in t.items){
          pid_list.push(t.items[i].pid);
        }
      }
      var remarks = {};
      for(var item in vm.CartInfo.brands){
        var b = vm.CartInfo.brands[item];
        remarks[b.Brand.id] = b.Brand['remark'];
      }
      $log.log("submit order for products ").log(pid_list);
      Orders.balance(pid_list,vm.selectedAddressId,vm.coupon_code,remarks).then(function(orderId){
        $log.log("submit order successfully: ").log(orderId);
        $state.go("app.my-order-detail", {id: orderId});
      }, function(e){
        $log.log("submit order failed: ").log(e);
      });
    }
    function getTotalShipFees(){
      var t = 0;
      if(vm.CartInfo==null)
        return 0;
      for(var i in vm.CartInfo.shipFees){
        t+=vm.CartInfo.shipFees[i];
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