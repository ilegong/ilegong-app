(function (window, angular) {
  "use strict";

  angular.module('ilegong.my', [])
  .controller('MyCtrl', MyCtrl)
  .controller('MyListCtrl',MyListCtrl)
  .controller('MyDetailCtrl',MyDetailCtrl)
  .controller('MyCartsCtrl',MyCartsCtrl)
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
  	       $scope.userDetail = new UserInfo(1,'lilei','昵称','none','男','单位','个性签名','手机号','邮箱','***');
  }
  function MyDetailCtrl($scope){
        $scope.userDetail = new UserInfo(1,'lilei','昵称','none','男','单位','个性签名','手机号','邮箱','***');
  }
  function MyCartsCtrl($scope){
      $scope.items=[new CartItem('title1','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg',11.5,5,'http://baidu.com'),
                    new CartItem('title2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg',6,7,'http://baidu.com')];
    $scope.buttonReduceClick = function(index)
    {
      if($scope.items[index].count > 1)
        $scope.items[index].count=Number($scope.items[index].count)-1;
    };
    $scope.buttonAddClick = function(index)
    {
      $scope.items[index].count=Number($scope.items[index].count) +1;
    };
    $scope.getTotallPrice = function()
    {
      $scope.totall=0;
      $scope.i=0;
      while($scope.i<$scope.items.length)
      {
        $scope.totall+=$scope.items[$scope.i].price * $scope.items[$scope.i].count;
        $scope.i++;
      }
      return $scope.totall;
    };
    $scope.removeAt=function(index)
    {
      $scope.items.splice(index,1);
    };
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
  function MyAddressesInfoCtrl($scope,$rootScope)
  {

 
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
  }
  function MyCouponsCtrl($scope)
  {

    $scope.coupons = [
      new Coupon('铁棍山药2','n1',1,12.3,'date1','date2','http://baidu.com'),
      new Coupon('铁棍山药3','n1',1,1.3,'date1','date2','http://baidu.com'),
      new Coupon('铁棍山药4','n1',2,1,'date1','date2','http://baidu.com'),
      new Coupon('铁棍山药5','n1',2,12.31,'date1','date2','http://baidu.com'),
      new Coupon('铁棍山药6','n1',3,12.3,'date1','date2','http://baidu.com'),
      new Coupon('铁棍山药7','n1',3,12.3,'date1','date2','http://baidu.com')
    ]

  }
  function MyOffersCtrl($scope)
  {
    

    $scope.offers = [
      new Offer('n1','d1',11.1,1,'http://baidu.com'),
      new Offer('n2','d2',3.54,1,'http://baidu.com'),
      new Offer('n3','d3',3,2,'http://baidu.com'),
      new Offer('n4','d4',1.2,2,'http://baidu.com'),
      new Offer('n5','d5',5.5,3,'http://baidu.com'),
      new Offer('n6','d6',3.2,3,'http://baidu.com')

    ]

  }
  function MyOrdersCtrl($scope,$rootScope)
  {


    $scope.orders = [
      new OrdersItem(1,1,'n1','http://baidu.com',30,[
          new OrdersProductItem('t1','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',15,1),
          new OrdersProductItem('t2','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',7.5,2)
        ]),
      new OrdersItem(2,2,'n1','http://baidu.com',30,[
          new OrdersProductItem('t1','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',15,1),
          new OrdersProductItem('t2','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',7.5,2)
        ]),
      new OrdersItem(3,3,'n1','http://baidu.com',30,[
          new OrdersProductItem('t1','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',15,1),
          new OrdersProductItem('t2','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',7.5,2)
        ]),
      new OrdersItem(4,4,'n1','http://baidu.com',0,[
          new OrdersProductItem('t1','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',15,1),
          new OrdersProductItem('t2','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',7.5,2)
        ]),
      new OrdersItem(5,5,'n1','http://baidu.com',30,[
          new OrdersProductItem('t1','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',15,1),
          new OrdersProductItem('t2','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',7.5,2)
        ]),
      new OrdersItem(6,6,'n1','http://baidu.com',30,[
          new OrdersProductItem('t1','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',15,1),
          new OrdersProductItem('t2','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',7.5,2)
        ]),
      new OrdersItem(7,6,'n1','http://baidu.com',30,[
          new OrdersProductItem('t1','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',15,1),
          new OrdersProductItem('t2','http://51daifan-images.stor.sinaapp.com/files/201411/thumbs/d821d549dae1123.jpg','http://baidu.com',7.5,2)
        ])
    ]

    $scope.stateFilter = -1;

  }

  function MyOrderDetailCtrl($scope,$rootScope)
  {
    $scope.order = new OrderDetail(1,2,'dateC','dateP','name','tel','addr','com',12,'content',
      [
        new OrderDetailProduct('n1','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/d821d549dae_1123.jpg','http://www.tongshijia.com/products/20141123/jin_nian_xin_chan_cang_zhou_jin_si_xiao_zao.html',12,3),
        new OrderDetailProduct('n2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/d821d549dae_1123.jpg','http://www.tongshijia.com/products/20141123/jin_nian_xin_chan_cang_zhou_jin_si_xiao_zao.html',3,4)
      ]
      ,13,15);
    $scope.getTotalPrice = function()
    {
      var i = 0;
      var sum = 0;
      while(i<$scope.order.products.length)
      {
        sum += $scope.order.products[i].price * $scope.order.products[i].count;
        i++;
      }
      return sum;
    }

  }   
})(window, window.angular);