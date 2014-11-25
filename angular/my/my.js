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
  function MyCtrl($scope){
  	$scope.UserInfo = new UserInfo('Lilei');
  }
  /* @ngInject */
  function MyAccountLoginCtrl($scope){
  }
  /* @ngInject */
  function MyAccountRegisterCtrl($scope){
  }
  /* @ngInject */
  function MyIlegongCtrl($scope){
  }

  function MyListCtrl($scope){
  	       $scope.userDetail = {userId:1,userName:'lilei',nickname:'昵称',imgUrl:'none',sex:'男',company:'单位',content:'个性签名',telephone:'手机号',mail:'邮箱',password:'***'};

  }
  function MyDetailCtrl($scope){
        $scope.userDetail = {userId:1,userName:'lilei',nickname:'昵称',imgUrl:'none',sex:'男',company:'单位',content:'个性签名',telephone:'手机号',mail:'邮箱',password:'***'};
  }
  function MyCartsCtrl($scope){
      $scope.items=[{title:'title1',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg',price:11.5,count:5,linkUrl:'http://baidu.com'},
                    {title:'title2',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg',price:6,count:7,linkUrl:'http://baidu.com'}];
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
                              {title:'beijing',id:1,content:[
                                {title:'beijing-1',i:11,content:[
                                  {title:'beijing-1-1',id:111},
                                  {title:'beijing-1-2',id:112}]},
                                {title:"beijing-2",id:12,content:[
                                  {title:'beijing-2-1',id:121},
                                  {title:'beijing-2-2',id:122}]}]},
                              {title:'shanghai',id:2,content:[
                                {title:'shanghai-1',id:21,content:[
                                  {title:'shanghai-1-1',id:211},
                                  {title:'shanghai-1-2',id:212}]},
                                {title:'shanghai-2',id:22,content:[
                                  {title:'shanghai-2-1',id:221},
                                  {title:'shanghai-2-2',id:222}]}]}];


    $scope.order={userInfo:{
                            userId:1,
                            addresses:[
                                        {def:false,name:'name1',region_1:'beijing',region_2:'beijing-2',region_3:'beijing-2-1',address:'地址',telephone:'12345678911'},
                                        {def:true,name:'name2',region_1:'beijing',region_2:'beijing-2',region_3:'beijing-2-1',address:'地址',telephone:'12345678911'},
                                        {def:false,name:'name3',region_1:'shanghai',region_2:'shanghai-2',region_3:'shanghai-2-1',address:'地址',telephone:'12345678911'}
                            ],
                            promotionCode:""
                          },
                  products:[
                          {userName:'分享人1',
                            title:'商品1',
                            price:12,
                            count:2,
                            message:""},
                          {userName:'分享人2',
                            title:'商品2',
                            price:15,
                            count:1,
                            message:""},
                          {userName:'分享人3',
                            title:'商品3',
                            price:11.2,
                            count:6,
                            message:""}
                          ],
                    privilege:20,
                    freight:15

                };

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
                              {title:'beijing',id:1,content:[
                                {title:'beijing-1',i:11,content:[
                                  {title:'beijing-1-1',id:111},
                                  {title:'beijing-1-2',id:112}]},
                                {title:"beijing-2",id:12,content:[
                                  {title:'beijing-2-1',id:121},
                                  {title:'beijing-2-2',id:122}]}]},
                              {title:'shanghai',id:2,content:[
                                {title:'shanghai-1',id:21,content:[
                                  {title:'shanghai-1-1',id:211},
                                  {title:'shanghai-1-2',id:212}]},
                                {title:'shanghai-2',id:22,content:[
                                  {title:'shanghai-2-1',id:221},
                                  {title:'shanghai-2-2',id:222}]}]}];
      $scope.accessEditVisible=false;
      $scope.addresses=[
                         {def:false,name:'name1',region_1:'beijing',region_2:'beijing-2',region_3:'beijing-2-1',address:'地址',telephone:'12345678911'},
                         {def:true,name:'name2',region_1:'beijing',region_2:'beijing-2',region_3:'beijing-2-1',address:'地址',telephone:'12345678911'},
                         {def:false,name:'name3',region_1:'shanghai',region_2:'shanghai-2',region_3:'shanghai-2-1',address:'地址',telephone:'12345678911'}
                        ]
      $scope.values={accessEditVisible:false, editAddress:null,addressSelectedIndex:-1};
      $scope.values.editAddress={def:false,name:'namet',region_1_model:'shanghai',region_2_model:'shanghai-1',region_3_model:'shanghai-1-1',address:'addressT',telephone:'telT'};
      $scope.values.setEditAddress=function(index)
      {
        if(index==-1)
        {
          $scope.values.editAddress={def:false,name:'',region_1_model:'',region_2_model:'',region_3_model:'',address:'',telephone:''};
          return;
        }
        if(index>=0)
        {
          var t=$scope.addresses[index];

          $scope.values.editAddress={def:t.def,name:t.name,region_1_model:null,region_2_model:null,region_3_model:null,address:t.address,telephone:t.telephone};
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