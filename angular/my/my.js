(function (window, angular) {
  "use strict";

  angular.module('ilegong.my', [])
  .controller('MyCtrl', MyCtrl)

  .controller('MyListCtrl',MyListCtrl)
  .controller('MyDetailCtrl',MyDetailCtrl)
  .controller('MyCartsCtrl',MyCartsCtrl)
  .controller('MyOrderInfoCtrl',MyOrderInfoCtrl)

  .controller('MyAccountCtrl', MyAccountCtrl)
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  /* @ngInject */
  function MyCtrl($scope){
  	$scope.UserInfo = new UserInfo('Lilei');
  }
  /* @ngInject */
  function MyAccountCtrl($scope){
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
                              {title:'beijing',content:[
                                {title:'beijing-1',content:[
                                  {title:'beijing-1-1'},
                                  {title:'beijing-1-2'}]},
                                {title:"beijing-2",content:[
                                  {title:'beijing-2-1'},
                                  {title:'beijing-2-2'}]}]},
                              {title:'shanghai',content:[
                                {title:'shanghai-1',content:[
                                  {title:'shanghai-1-1'},
                                  {title:'shanghai-1-2'}]},
                                {title:'shanghai-2',content:[
                                  {title:'shanghai-2-1'},
                                  {title:'shanghai-2-2'}]}]}];


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
                          ]

                };
      $scope.selectRegion_1_onchange=function()
      {
        var e = document.getElementById('selectRegion_2');
        e.options.length=0;
      };
      $scope.selectRegion_1_onchange=function()
      {

      };
  }
})(window, window.angular);