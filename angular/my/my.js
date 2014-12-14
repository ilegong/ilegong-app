(function (window, angular) {
  "use strict";

  angular.module('ilegong.my', ['app.services'])
  .controller('MyCtrl', MyCtrl)
  .controller('MyListCtrl',MyListCtrl)
  .controller('MyDetailCtrl',MyDetailCtrl)
  .controller('MyOrderInfoCtrl',MyOrderInfoCtrl)
  .controller('MyAccountLoginCtrl', MyAccountLoginCtrl)
  .controller('MyAccountRegisterCtrl', MyAccountRegisterCtrl)
  .controller('MyIlegongCtrl', MyIlegongCtrl)


  .controller('MyAddressesInfoCtrl',MyAddressesInfoCtrl)
  .controller('MyCouponsCtrl',MyCouponsCtrl)
  .controller('MyOffersCtrl',MyOffersCtrl)
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  .controller('MyOrderDetailCtrl',MyOrderDetailCtrl)
  /* @ngInject */
  function MyCtrl($rootScope, $scope){
  	$scope.UserInfo = new UserInfo(1,'lilei','昵称','none','男','单位','个性签名','手机号','邮箱','***');
    $rootScope.hideTabs = false;
  }
  /* @ngInject */
  function MyAccountLoginCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
  }
  /* @ngInject */
  function MyAccountRegisterCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
  }
  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
  }

  function MyListCtrl($scope){
    var vm = this;
    active();
    $scope.userDetail = new UserInfo(1,'lilei','昵称','none','男','单位','个性签名','手机号','邮箱','***');
    function active()
    {

    }
  }
  function MyDetailCtrl($scope,$rootScope,$http,UserDetail){
    var vm = this;
    active();
    
    function active()
    {
      UserDetail.list().then(function(data){
        vm.userDetail = data;
      })
    }
  }
  function MyOrderInfoCtrl($scope){
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

  }
  function MyAddressesInfoCtrl($scope,$rootScope,Orders)
  {

    var vm = this;
    active();
    $rootScope.hideTabs = true;
    
    $scope.accessEditVisible=false;
    $scope.addresses=[
                                      new AddressItem(false,'name1','beijing','beijing-2','beijing-2-1','地址','12345678911'),
                                      new AddressItem(true,'name2','beijing','beijing-2','beijing-2-1','地址','12345678911'),
                                      new AddressItem(false,'name3','shanghai','shanghai-2','shanghai-2-1','地址','12345678911')
                          ];
    $scope.values={accessEditVisible:false, editAddress:null,addressSelectedIndex:-1};
    $scope.values.editAddress=new AddressItem(false,'namet','shanghai','shanghai-1','shanghai-1-1','addressT','telT');
    $scope.values.setEditAddress=function(index)
    {
      if(index==-1)
      {
        $scope.values.editAddress=new AddressItem('','','','','','');
        return;
      }
      if(index>=0)
      {
        var t=$scope.addresses[index];

        $scope.values.editAddress=new AddressItem(t.def,t.name,null,null,null,t.address,t.telephone);
         var r = $rootScope.getRegion_1_model(t.region_1);
         
        $scope.values.editAddress.region_1_model = r.content;
        var r2 = $rootScope.getReion_2_model(r.id,t.region_2);
                  
        $scope.values.editAddress.region_2_model = r2.content;
        var r3 = $rootScope.getRegion_3_model(r.id,r2.id,t.region_3);
                 
        $scope.values.editAddress.region_3_model = r3.content;

        return;

      }
    }



    $scope.values.deleteAddressItem=function(index)
    {
      $scope.addresses.splice(index,1);
    }
    $scope.values.getDefColor=function(index)
    {
      if($scope.addresses[index].def==true)
      {
        return '#eeeeee';
      }
      return 'white'; 
    }
    $scope.values.setDef=function(index)
    {
      var i =0;
      while(i<$scope.addresses.length)
      {
        $scope.addresses[i].def= false;
        i++;
      }
      $scope.addresses[index].def=true;
    }


    function active()
    {
      Orders.allProvince().then(function(data){
          vm.provincesT = data ;
          vm.provinces = Array();
 
          for(var zzz in vm.provincesT)
          {
           vm.provinces.push({'id':zzz,'name':vm.provincesT[zzz]});
          }
        }
      );
      
    }
    vm.getCities = function(id)
    {
      if(id==null)
      {
        vm.cities = null;
        vm.counties = null;
        return;
      }
      Orders.getCities(vm.provinceModel.id).then(function(data){
        vm.citiesT = data;
        vm.cities = Array();
        for(var zzz in vm.citiesT)
        {
          vm.cities.push({'id':zzz,'name':vm.citiesT[zzz]});
        }
 

      })

        
    }
    vm.getCounties = function(id)
    {
      if(id == null)
      {
        vm.counties = null;
        return;

      }
      Orders.getCounties(id).then(function(data){
        vm.countiesT = data;
        vm.counties = Array();

        for(var zzz in vm.countiesT)
        {
          vm.counties.push({id:zzz,name:vm.countiesT[zzz]});
        }

    })
    }

  }
  function MyCouponsCtrl($scope,$rootScope,Coupons)
  {
    $rootScope.hideTabs = true;
    var vm = this;
    active();

    function active()
    {
      Coupons.list(1).then(function(data){
        vm.coupons = data.coupons;
        var brandsT = data.brands;  
        vm.brands = Array();
        for(var zzz in brandsT)
        {
          vm.brands[zzz] = brandsT[zzz];
        }
        
      })
    }
  }
  function MyOffersCtrl($scope,$rootScope,$http,Offers)
  {
    $rootScope.hideTabs = true;
    var vm = this;
    active();
    function active()
    {
      Offers.list(1).then(function(data){
        vm.sharedOffers = data.sharedOffers;
        vm.expiredIds = data.expiredIds;
        vm.soldOuts = data.soldOuts;
        var brandsT = data.brands;
        vm.brands = Array();
        for(var zzz in brandsT)
        {

          vm.brands[zzz] = brandsT[zzz];
      
        }

      });

    }
  }
  function MyOrdersCtrl($scope,$rootScope,$http,Orders){
  
    $rootScope.hideTabs = true;
    var vm = this;
    active();
    
    vm.stateFilter = -1;
    function active()
    {
 
      Orders.list().then(function(data){
        vm.orders = data.orders;
        vm.brands = data.brands;
        vm.order_carts = data.order_carts;
        vm.ship_type = data.ship_type;
    
      });

    }

  }

  function MyOrderDetailCtrl($scope,$rootScope,$http,OrderDetail)
  {
    var vm = this;
    active();
    
    $scope.getTotalPrice = function()
    {
      var sum = 0;
      
      for(var key in vm.carts)
      {
        sum+=Number(vm.carts[key].Cart.price);
      }
      
      return sum;
    }
    function active()
    {
      OrderDetail.list().then(function(data)
      {
        vm.order = data.order;
        vm.carts = data.carts;
        vm.ship_type = data.ship_type;
        vm.expired_pids = data.expired_pids;
        vm.no_more_money = data.no_more_money;
        vm.products = data.products;
      })
    }
  }   
})(window, window.angular);