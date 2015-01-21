(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($q,$log,$rootScope, $scope, $stateParams,$http,Products,Carts,Addresses,Orders){
    var vm = this;
    vm.count=1;
    vm.from = $stateParams.from;
    vm.rating = 5;
    vm.confirmComment = confirmComment;
    vm.menuClick = function(index){vm.isShowMenuContents[index] = !vm.isShowMenuContents[index];}
    vm.isShowStar = function(comment,starIndex){return comment.Comment.rating > starIndex}  
    vm.getShichiCommentNum = function(){return _.countBy(vm.comment,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'?'num':'notshow'})['num']}
    vm.getEvaluateCommentNum = function(){return _.countBy(vm.comment,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'?'notshow':'num'})['num']}
    vm.commentT = {rating:5,text:'',images:[]};
    vm.isShowMakeCommentStar = function(index){return vm.commentT.rating > index}
    vm.specsClick = specsClick;
    activate();
    
    function activate(){
      vm.isShowMenuContents = [false,false,true];
      vm.specsChecks = {};
      vm.currentSpecs = 0;
      var id = $stateParams.id;
      Products.getProduct(id).then(function(data){
        vm.product = data.product;
        vm.product.Product.specs = JSON.parse(vm.product.Product.specs);



        vm.recommends = data.recommends;
        vm.brand = data.brand;




        $log.log(vm.product);
      }, function(e){$log.log(e)});
      Products.getProductContent(id).then(function(data){
        vm.content = data.content;
      }, function(e){$log.log(e)});
      Products.getProductComment(id).then(function(data){
        vm.comment = data;
      }, function(e){$log.log(e)});
    }

    function specsClick(group,name){
      _.each(vm.specsChecks[group],function(item){item.value = false});
      vm.specsChecks[group][name].value = true;
      vm.currentSpecs = _.find(_.pairs(vm.product.Product.specs.map),function(item){return item[1].name == name})[0];
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
    function confirmComment(){
      for(var i=0;i<30;i++)
        $log.log('aqaq');
      $log.log(vm.product);
      Products.makeComment(vm.product.Product.id,vm.commentT.rating,vm.commentT.text,null).then(function(data){
        activate();
        $log.log('comment success');
        $log.log(data);
      });
    }
    vm.addToCart = function(){
      $log.log("add product " + $stateParams.id + " to cart");
      Carts.addCartItem($stateParams.id, vm.count, vm.currentSpecs, 1, 0).then(function(result){
        Carts.getCartItems().then(function(result){
          $rootScope.updateCart(result);
        });
      }, function(e){$log.log("add to cart failed: ").log(e)});
    }
  }
})(window, window.angular);





