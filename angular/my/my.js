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

    $scope.regionSelectItems=[
                              new RegionSelectItem('beijing',1,[
                                new RegionSelectItem('beijing-1',11,[
                                  new RegionSelectItem('beijing-1-1',111,null),
                                  new RegionSelectItem('beijing-1-2',112,null)]),
                                new RegionSelectItem("beijing-2",12,[
                                  new RegionSelectItem('beijing-2-1',121,null),
                                  new RegionSelectItem('beijing-2-2',122,null)])]),
                              new RegionSelectItem('shanghai',2,[
                                new RegionSelectItem('shanghai-1',21,[
                                  new RegionSelectItem('shanghai-1-1',211,null),
                                  new RegionSelectItem('shanghai-1-2',212,null)]),
                                new RegionSelectItem('shanghai-2',22,[
                                  new RegionSelectItem('shanghai-2-1',221,null),
                                  new RegionSelectItem('shanghai-2-2',222,null)])])];



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
  function MyAddressesInfoCtrl($scope)
  {

      $scope.regionSelectItems=[
                              new RegionSelectItem('beijing',1,[
                                new RegionSelectItem('beijing-1',11,[
                                  new RegionSelectItem('beijing-1-1',111,null),
                                  new RegionSelectItem('beijing-1-2',112,null)]),
                                new RegionSelectItem("beijing-2",12,[
                                  new RegionSelectItem('beijing-2-1',121,null),
                                  new RegionSelectItem('beijing-2-2',122,null)])]),
                              new RegionSelectItem('shanghai',2,[
                                new RegionSelectItem('shanghai-1',21,[
                                  new RegionSelectItem('shanghai-1-1',211,null),
                                  new RegionSelectItem('shanghai-1-2',212,null)]),
                                new RegionSelectItem('shanghai-2',22,[
                                  new RegionSelectItem('shanghai-2-1',221,null),
                                  new RegionSelectItem('shanghai-2-2',222,null)])])];
    
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
           var r = $scope.values.getRegion_1_model(t.region_1);
           
          $scope.values.editAddress.region_1_model = r.content;
          var r2 = $scope.values.getReion_2_model(r.id,t.region_2);
                    
          $scope.values.editAddress.region_2_model = r2.content;
          var r3 = $scope.values.getRegion_3_model(r.id,r2.id,t.region_3);
                   
          $scope.values.editAddress.region_3_model = r3.content;

          return;

        }
      }

      $scope.values.getRegion_1_model=function(title)
      {
        var i=0;
        while(i<$scope.regionSelectItems.length)
        {
          if($scope.regionSelectItems[i].title == title)
          {
            return {id:i,content:$scope.regionSelectItems[i]};
          }
          i++;
        }
        return null;
      }
      $scope.values.getReion_2_model=function(index_1,title)
      {
        var t = $scope.regionSelectItems[index_1];
        var i = 0;

        while(i<t.content.length)
        {
          if(t.content[i].title==title)
          {
            return {id:i,content:t.content[i]};
          }
          i++;
        }

        return null;
      }
      $scope.values.getRegion_3_model=function(index_1,index_2,title)
      {
        var t = $scope.regionSelectItems[index_1].content[index_2];
        var i = 0;
        while(i<t.content.length)
        {
          if(t.content[i].title==title)
          {
            return {id:i,content:t.content[i]};
          }
          i++;
        }
        return null;
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
})(window, window.angular);