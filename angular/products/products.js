(function (window, angular) {
  "use strict";

  angular.module('ilegong.products', [])
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($scope,$stateParams){
    $scope.pid=1;
    $scope.id = $stateParams.id;
    $scope.item = 
    [
      {id:1,title:'搜狐潘婷家的喀什灰枣君',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg',hasRedPacket:false,postDetail:'2斤包邮',price:40,oldPrice:0,postStyle:'快递：人民币15.00',count:1,
        detail:[{type:'title',style:'',content:'价格/规格'},{type:'content',style:'',content:'价格：40元/斤\r\n品种：灰枣\r\n产地：新疆喀什\r\n规格：1斤\r\n邮费：1斤邮费15元（2斤全国包邮）\r\n尺寸：宽2cm高3cm\r\n备注：从新疆喀什直接发货，路途遥远，所需时间较长，大概7-10天，还请耐心等待。'},{type:'title',style:'',content:'商品详情'},{type:'content',style:'',content:'灰枣个头较小，肉质比较紧实，糖分更高，吃起来口感更好，属于实力低调派，灰枣就是有名的若羌枣，主要产于南疆。\r\n灰枣具有极高的营养价值，适合孕妇、女生、小孩、老人食用。潘婷家的灰枣都是潘婷爸妈自己种植、采摘、晒干、清理的，在生产过程中不含任何添加剂，大枣经过阳光自然晒干，保持灰枣最原始、天然的味道和营养价值。\r\n\r\n潘婷的家在喀什，中国最西北的一个行政区域，距离首都上万里路程，遥远到有些不真实。藏在异域风情的面纱下，这里有沙漠的热情，戈壁的狂野，也有绿洲的温柔，瓜果的甜蜜。喀什古称疏勒，是古代丝绸之路重镇，也是一代红颜香妃的故乡，赤水流沙，几千年的风沙吹啊吹，留下这片雪水灌溉滋养的绿洲，白杨挺拔，红柳坚韧，喀什麦盖提县，地处沙漠边缘，热量丰富，日照充足，昼夜温差大，是新疆灰枣的最主要产区。叶尔羌枣是我们自家果园种植，果树不打药不催熟，枣子自然晾干、人工清洗并包装后快递直送到大家手中，希望能被大家信任和喜欢。'},{type:'image',style:'',content:'https://mmbiz.qlogo.cn/mmbiz/UuGM2hE8WNHACm8AfcHLnXYFIVU7uFCb120tf4wLuU8Xqtb6QiaS8j5G7ObHeDsUD7zjSbRYBKxpTCxFd0oQyxw/0'}],
        evaluate:[{name:'name1',rank:'A',content:'good',time:'2014-10-11 sdf'}]},
      {id:2,title:'西域美侬椒盐碧根果250g',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/873270830e5_1119.jpg',hasRedPacket:true,postDetail:'包邮',price:24.99,oldPrice:64.5,postStyle:'快递：包邮',count:1,
        detail:[{type:'title',style:'',content:'价格/规格'},{type:'content',style:'color:red;',content:'价格：24.99\r\n规格：250g/袋\r\n口味：椒盐口味\r\n品种：碧根果\r\n保质期：265天\r\n生产日期：2014-10-10 至 2014-10-24\r\n邮费：包邮'},{type:'title',style:'',content:'商品详情'},{type:'image',style:'',content:'https://mmbiz.qlogo.cn/mmbiz/UuGM2hE8WNHACm8AfcHLnXYFIVU7uFCbbaGCCeU6a1kIltowGGewyZXvNvbXajINwyhTzjBRfWsibSGEGic8mjRw/0'},{type:'image',style:'',content:'https://mmbiz.qlogo.cn/mmbiz/UuGM2hE8WNHACm8AfcHLnXYFIVU7uFCbJB7v7xUCMqva0aw033ZVOYiaEibXbMyuic1yhquN2zLPbDYiaD8Z7h2pZA/0'},{type:'content',style:'',content:'大家好，我叫李春望，08年的我当时还是一名打工族，朝九晚五，过着和大家一样的生活。改变我人生的也就是那年的一次旅行，因为倍感城市生活节奏带来的空虚感，6月份我来了一场说走就走的旅行。当时的目的地就是新疆，半个月的旅行可以说让我对生活有了新的价值取向。回来后我做的第一件事就是辞职，这在当时就业压力大的情况下，是一件不可想象事。'}],
        evaluate:[{name:'name1',rank:'A',content:[{type:'content',content:'good'},{type:'image',content:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/873270830e5_1119.jpg'}],time:'2014-10-11 sdf'},{name:'name2',rank:'B',content:[{type:'content',content:'normal'}],time:'2014-10-11 sd2f'},{name:'name3',rank:'C',content:[{type:'content',content:'bad'}],time:'2014-10-11 sdfaa'}]}
    ]

    $scope.buttonReduceClick = function()
    {
      if($scope.item[$scope.pid].count > 1)
        $scope.item[$scope.pid].count=Number($scope.item[$scope.pid].count)-1;
    };
    $scope.buttonAddClick = function()
    {
      $scope.item[$scope.pid].count=Number($scope.item[$scope.pid].count)+1;
    };
    $scope.getRankText = function(rank)
    {
      if(rank=='A')
        return '好评';
      if(rank=='B')
        return '中评';
      if(rank=='C')
        return '差评';
    }
    $scope.getRankColor = function(rank)
    {
      if(rank=='A')
        return 'green';
      if(rank=='B')
        return 'gray';
      if(rank=='C')
        return 'red';
    }
  }


})(window, window.angular);