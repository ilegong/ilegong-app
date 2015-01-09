(function (window, angular) {
  "use strict";

  angular.module('ilegong.products', [])
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($q,$log,$rootScope, $scope, $stateParams,$http,Products,Carts,Addresses,Orders){
    var vm = this;
    vm.count=1;
    vm.from = $stateParams.from;
    activate();
    
    function activate(){
      var id = $stateParams.id;
      Products.getProduct(id).then(function(data){
        vm.product = data.product;
        vm.recommends = data.recommends;
        vm.brand = data.brand;
      }, function(e){$log.log(e)});
      Products.getProductContent(id).then(function(data){
        vm.content = data.content;
      }, function(e){$log.log(e)});
      Products.getProductComment(id).then(function(data){
        vm.comment = data;
      }, function(e){$log.log(e)});
    }

    $scope.buttonReduceClick = function(){
      if(vm.count > 1)
        vm.count=Number(vm.count)-1;
    };
    $scope.buttonAddClick = function() {
      vm.count=Number(vm.count)+1;
    };
    $scope.getRankText = function(rank) {
      if(rank==5)
        return '好评';
      if(rank==4)
        return '四分';
      if(rank==3)
        return '中评';
      if(rank==2)
        return '两分';
      if(rank==1)
        return '差评';
    }
    $scope.getRankColor = function(rank) {
      if(rank==5)
        return 'green';
      if(rank==4)
        return 'gray';
      if(rank==3)
        return 'gray';
      if(rank==2)
        return 'red';
      if(rank==1)
        return 'red';
    }
    // $scope.click = function(){
    //   navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    //     destinationType: Camera.DestinationType.DATA_URL
    //   });
    // }
    vm.addToCart = function(){
      $log.log("add product " + vm.product.Product.id + " to cart");
      Carts.addCartItem(vm.product.Product.id,vm.count,0,1,0).then(function(result){
        $log.log("add to cart successfully: ").log(result);
      }, function(e){$log.log("add to cart failed: ").log(e)});
    }
  }
})(window, window.angular);





