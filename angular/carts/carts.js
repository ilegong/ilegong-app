(function (window, angular) {
  "use strict";

  angular.module('ilegong.carts', ['app.services','ionic'])
  .controller('ShoppingCartsCtrl',ShoppingCartsCtrl)
  .controller('OrderInfoCtrl',OrderInfoCtrl)

  function ShoppingCartsCtrl($q,$log,$scope,$rootScope,Carts,Addresses,Orders){
    $rootScope.hideTabs = false;
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
    }
    function reduceCartItemNum(cart) {
      var originalNum = cart.num;
      if(cart.num > 1){
        cart.num = Number(cart.num)-1;
      }
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
      var defer = $q.defer();
      
      var items=[];
      for(var item in vm.carts){
        items.push(Number(vm.carts[item].Cart.product_id));
      }
      Addresses.list().then(function(adds){
        var id = adds[0].OrderConsignees.id;
        for(var item in adds){
          if(adds[item].OrderConsignees.status == 1){
            id = adds[item].OrderConsignees.id;
            break;
          }
        }
        
        Orders.cartInfo(items,id,null).then(function(result){
          defer.resolve(result);
          
        });
      })
      $rootScope.cartInfoPromise = defer.promise;
    }
  }

  function OrderInfoCtrl($ionicHistory,$log,$scope,$rootScope,Addresses,Orders){
    $rootScope.hideTabs = true;
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

    $scope.values={accessDivVisible:false, accessSelectedId:-1};

    function activate(){
      Orders.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      })
      getAddresses();
      cartRefresh();
    }
    function getAddresses(){
        Addresses.list().then(function(adds){
        vm.addresses = adds;
        for(var i in vm.addresses){
          var t = vm.addresses[i];
          //$rootScope.selectedAddrId = 
          if(t.OrderConsignees.status == 1){
            $scope.values.accessSelectedId = Number(t.OrderConsignees.id);
            break;
          }
        }
      })
    }
    function cartRefresh(){
      $rootScope.cartInfoPromise.then(function(data){
        vm.CartInfo = data.data;
        $rootScope.cartInfoPromise = null;
      })
    }
    function loadBrandById(id){
      for(var item in vm.CartInfo.brands){
        var t = vm.CartInfo.brands[item];
        if(t.Brand.id == id){
          return t;
        }
        return null;
      }
    }
    function confirmCoupon_code(){
      vm.coupon_code = vm.coupon_code_t;
      console.log(vm.coupon_code);
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

      Orders.balance(pid_list,$scope.values.accessSelectedId,vm.coupon_code,remarks);
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
      Addresses.add(vm.newAddr_name,vm.newAddr_address,vm.provinceModel.id,vm.cityModel.id,vm.countyModel.id,vm.newAddr_mobilephone);
      getAddresses();
    }
  }
})(window, window.angular);