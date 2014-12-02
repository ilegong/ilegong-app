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
    $scope.couponsState = [
      {state:1,string:'未使用',color:'#73a839'},
      {state:2,string:'已使用',color:'#999'},
      {state:3,string:'已过期',color:'#999'}
    ]
    $scope.coupons = [
      {title:'铁棍山药2',name:'n1',state:1,price:12.3,date_begin:'date1',date_end:'date2',shopUrl:'http://baidu.com'},
      {title:'铁棍山药3',name:'n1',state:1,price:1.3,date_begin:'date1',date_end:'date2',shopUrl:'http://baidu.com'},
      {title:'铁棍山药4',name:'n1',state:2,price:1,date_begin:'date1',date_end:'date2',shopUrl:'http://baidu.com'},
      {title:'铁棍山药5',name:'n1',state:2,price:12.31,date_begin:'date1',date_end:'date2',shopUrl:'http://baidu.com'},
      {title:'铁棍山药6',name:'n1',state:3,price:12.3,date_begin:'date1',date_end:'date2',shopUrl:'http://baidu.com'},
      {title:'铁棍山药7',name:'n1',state:3,price:12.3,date_begin:'date1',date_end:'date2',shopUrl:'http://baidu.com'},
    ]
    $scope.getStateString = function(pState)
    {
      var i =0;
      while(i<$scope.couponsState.length)
      {
        if($scope.couponsState[i].state==pState)
          return $scope.couponsState[i].string;
        i++;
      }
      return '';
    }
    $scope.getStateColor = function(pState)
    {

            var i =0;
      while(i<$scope.couponsState.length)
      {
        if($scope.couponsState[i].state==pState)
        {
          
          return $scope.couponsState[i].color;
        }
        i++;
      }
      return '';
    }
    $scope.isCouponAvailable = function(pState)
    {
      return pState==1?true:false;
    }
  }
  function MyOffersCtrl($scope)
  {
    

    $scope.offerState = [
      {state:1,string:'未使用'},
      {state:2,string:'已使用'},
      {state:3,string:'已过期'}
    ]
    $scope.offers = [
      {name:'n1',date:'d1',price:11.1,state:1,linkUrl:'http://baidu.com'},
      {name:'n2',date:'d2',price:3.54,state:1,linkUrl:'http://baidu.com'},
      {name:'n3',date:'d3',price:3,state:2,linkUrl:'http://baidu.com'},
      {name:'n4',date:'d4',price:1.2,state:2,linkUrl:'http://baidu.com'},
      {name:'n5',date:'d5',price:5.5,state:3,linkUrl:'http://baidu.com'},
      {name:'n6',date:'d6',price:3.2,state:3,linkUrl:'http://baidu.com'}

    ]
    $scope.getOfferString = function(pState)
    {
      var i =0;
      while(i<$scope.offerState.length)
      {
        if($scope.offerState[i].state == pState)
          return $scope.offerState[i].string;
        i++;
      }
      return '';
    }
  }
  function MyOrdersCtrl($scope,$rootScope)
  {


    $scope.orders = [
      {id:1,state:1,name:'n1',nameUrl:'http://baidu.com',price:30,products:[
          {title:'t1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:15,count:1},
          {title:'t2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:7.5,count:2}
        ]},
        {id:2,state:2,name:'n1',nameUrl:'http://baidu.com',price:30,products:[
          {title:'t1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:15,count:1},
          {title:'t2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:7.5,count:2}
        ]},
        {id:3,state:3,name:'n1',nameUrl:'http://baidu.com',price:30,products:[
          {title:'t1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:15,count:1},
          {title:'t2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:7.5,count:2}
        ]},
        {id:4,state:4,name:'n1',nameUrl:'http://baidu.com',price:30,products:[
          {title:'t1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:15,count:1},
          {title:'t2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:7.5,count:2}
        ]},
        {id:5,state:5,name:'n1',nameUrl:'http://baidu.com',price:30,products:[
          {title:'t1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:15,count:1},
          {title:'t2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:7.5,count:2}
        ]},
        {id:6,state:6,name:'n1',nameUrl:'http://baidu.com',price:30,products:[
          {title:'t1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:15,count:1},
          {title:'t2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:7.5,count:2}
        ]},
        {id:7,state:6,name:'n1',nameUrl:'http://baidu.com',price:30,products:[
          {title:'t1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:15,count:1},
          {title:'t2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:'http://baidu.com',price:7.5,count:2}
        ]}
    ]

    $scope.stateFilter = -1;

  }   
})(window, window.angular);