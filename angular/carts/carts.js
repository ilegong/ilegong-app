(function (window, angular) {
  "use strict";

  angular.module('ilegong.carts', ['app.services'])
  .controller('ShoppingCartsCtrl',ShoppingCartsCtrl)
  .controller('OrderInfoCtrl',OrderInfoCtrl)
  function ShoppingCartsCtrl($log,$scope,$rootScope,Carts){
    $rootScope.hideTabs = false;
    var vm = this;
    vm.active = function()
    {
      Carts.list().then(function(data){
        vm.total_price = data.total_price;
        vm.carts = data.carts;
 

      })
    }
    vm.active();

    $scope.items=[new CartItem('title1','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg',11.5,5,'http://baidu.com'),
                  new CartItem('title2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg',6,7,'http://baidu.com')];
    $scope.buttonReduceClick = function(cart)
    {
      if(cart.num > 1)
        cart.num=Number(cart.num)-1;
    };
    $scope.buttonAddClick = function(cart)
    {
      cart.num=Number(cart.num) +1;
    };
    vm.getTotallPrice = function()
    {
      var totall=0;
      var i = 0;
      while(i<vm.carts.length)
      {
        vm.totall+=vm.carts[i].Cart.price * vm.carts[i].Cart.num;
        i++;
      }
      return totall;
    };
    $scope.removeAt=function(index)
    {
      $scope.items.splice(index,1);
    };


    vm.del = function(id)
    {
      Carts.del(id).then(function(data){
        $log.log(data); 
      });
      vm.active();
    }
  }

  function OrderInfoCtrl($scope,$rootScope){
 
    var vm = this;
    //$rootScope.hideTabs = true;
    active();
    $scope.order = new Order(new UserInfoWithAddresses(1,'lilei','昵称','none','男','单位','个性签名','手机号','邮箱','***',[
                                        new AddressItem(false,'name1','beijing','beijing-2','beijing-2-1','地址','12345678911'),
                                        new AddressItem(true,'name2','beijing','beijing-2','beijing-2-1','地址','12345678911'),
                                        new AddressItem(false,'name3','shanghai','shanghai-2','shanghai-2-1','地址','12345678911')
                            ]),
                  [
                          new OrderProductItem('分享人1',
                            '商品1',
                            12,
                            2,
                            ""),
                          new OrderProductItem('分享人2',
                            '商品2',
                            15,
                            1,
                            ""),
                          new OrderProductItem('分享人3',
                            '商品3',
                            11.2,
                            6,
                            "")
                          ],
                    "",
                    20,
                    15

                );

      $scope.getTotallPrice=function()
      {
        var i=0;
        var totall=0;
        while(i < $scope.order.products.length)
        {
          var t = $scope.order.products[i];
          totall += t.price * t.count;
          i++;
        }
        return totall;
      }
        $scope.values={accessDivVisible:false,accessSelectedIndex:-1};

        function active()
        {
          vm.provinces = $rootScope.allProvince();
        }

        vm.getCities = function(id)
        {
          if(id==null)
          {
            vm.cities = null;
            vm.counties = null;
            return;
          }
          vm.cities = $rootScope.getCities(id);
        }
        vm.getCounties = function(id)
        {
          if(id == null)
          {
            vm.counties = null;
            return;
          }
          vm.counties = $rootScope.getCounties(id);
        }


  }
 
})(window, window.angular);