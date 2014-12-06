(function (window, angular) {
  "use strict";

  angular.module('ilegong.carts', ['app.services'])
  .controller('ShoppingCartsCtrl',ShoppingCartsCtrl)

  function ShoppingCartsCtrl($scope,$rootScope){
    $rootScope.hideTabs = false;
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
 
})(window, window.angular);