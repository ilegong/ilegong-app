(function (window, angular) {
  "use strict";

  angular.module('ilegong.carts', ['app.services','ionic'])
  .controller('ShoppingCartsCtrl',ShoppingCartsCtrl)
  .controller('OrderInfoCtrl',OrderInfoCtrl)
  function ShoppingCartsCtrl($q,$log,$scope,$rootScope,Carts,Addresses,Orders){
    $rootScope.hideTabs = false;
    var vm = this;
    vm.active = function(){
      Carts.list().then(function(data){
        vm.total_price = data.total_price;
        vm.carts = data.carts;
      })
    }
    vm.active();
    $scope.buttonReduceClick = function(cart)
    {
      var originalNum = cart.num;
      if(cart.num > 1){
        cart.num = Number(cart.num)-1;
      }
      Carts.editNum(cart.id,cart.num).then(function(result){}, function(e){
        cart.num = originalNum;
      });
    };
    $scope.buttonAddClick = function(cart){
      var t = cart.num;
      cart.num=Number(cart.num) +1;
      Carts.editNum(cart.id,cart.num).then(function(result){
        if(result.success == false){
          cart.num = t;
        }
      }, function(e){
        cart.num = original
      });
    };
    vm.getTotallPrice = function(){
      var totall=0;
      var i = 0;
      while(i<vm.carts.length){
        vm.totall+=vm.carts[i].Cart.price * vm.carts[i].Cart.num;
        i++;
      }
      return totall;
    };
    $scope.removeAt=function(index){
      $scope.items.splice(index,1);
    };
    vm.del = function(id){
      Carts.del(id).then(function(data){
          
      });
      vm.active();
    }
    vm.confirm = function(){
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
    var vm = this;
    $rootScope.hideTabs = true;
    active();




    $scope.values={accessDivVisible:false, accessSelectedId:-1};

    function active(){
      Orders.getProvinces(function(provinces){
        vm.provinces = provinces;
      })
      getAddresses();
      cartRefresh();
    }
    vm.goBack = function(){
      $ionicHistory.goBack();
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
    vm.loadBrandById = function(id){
      for(var item in vm.CartInfo.brands){
        var t = vm.CartInfo.brands[item];
        if(t.Brand.id == id){
          return t;
        }
        return null;
      }
    }
    vm.confirmCoupon_code = function(){
      vm.coupon_code = vm.coupon_code_t;
      console.log(vm.coupon_code);
    }
    vm.confirm = function(){
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
    vm.getTotalShipFees = function(){
      var t = 0;
      if(vm.CartInfo==null)
        return 0;
      for(var i in vm.CartInfo.shipFees){
        t+=vm.CartInfo.shipFees[i];
      }
      return t;
    }
    vm.getCities = function(id){
      if(id==null){
        vm.cities = null;
        vm.counties = null;
        return;
      }
      vm.cities = $rootScope.getCities(id);
    }
    vm.getCounties = function(id){
      if(id == null){
        vm.counties = null;
        return;
      }
      vm.counties = $rootScope.getCounties(id);
    }
    vm.addAddress = function(){
      Addresses.add(vm.newAddr_name,vm.newAddr_address,vm.provinceModel.id,vm.cityModel.id,vm.countyModel.id,vm.newAddr_mobilephone);
      getAddresses();
    }
  }
})(window, window.angular);