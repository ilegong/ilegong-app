(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($state,$ionicPopup,$q,$log,$rootScope, $scope, $stateParams,$http,Products,Carts,Addresses,Orders){
    var vm = this;
    vm.count=1;
    vm.from = $stateParams.from;
    vm.rating = 5;
    vm.confirmComment = confirmComment;
    vm.isShowStar = function(comment,starIndex){return comment.Comment.rating > starIndex}  
    vm.commentT = {rating:5,text:'',images:[]};
    vm.isShowMakeCommentStar = function(index){return vm.commentT.rating > index}
    vm.specsClick = specsClick;
    vm.showTabs = function(){$rootScope.hideTabs = false;}
    vm.getReputationComments = function(){return _.filter(vm.comment,function(comment){return comment.Comment.is_shichi_tuan_comment != '1'})}
    vm.getTryingComments = function(){return _.filter(vm.comment,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'})}
    vm.toTryingCommentsPage = toTryingCommentsPage;
    vm.toReputationCommentsPage = toReputationCommentsPage;
    activate();
    
    function activate(){
      vm.showProductIntro = false;
      vm.specsChecks = {};
      vm.currentSpecs = 0;
      vm.id = $stateParams.id;
      vm.from = $stateParams.from;
      Products.getProduct(vm.id).then(function(data){
        vm.product = data.product;
        if(typeof(vm.product.Product.specs) === "string"){
          vm.product.Product.specs = JSON.parse(vm.product.Product.specs);
        }
        vm.recommends = _.pairs(data.recommends);
        vm.brand = data.brand;
      }, function(e){$log.log(e)});
      Products.getProductContent(vm.id).then(function(data){
        vm.content = data.content;
      }, function(e){$log.log(e)});
      Products.getProductComment(vm.id).then(function(data){
        vm.comment = data;
      }, function(e){$log.log(e)});
    }

    function specsClick(group,name){
      _.each(vm.specsChecks[group],function(item){item.value = false});
      vm.specsChecks[group][name].value = true;
      vm.currentSpecs = _.find(_.pairs(vm.product.Product.specs.map),function(item){return item[1].name == name})[0];
    } 


    function toTryingCommentsPage(){
      if(vm.from == -1){//from main
        $state.go("app.product-detail-comments",{id: vm.id, from: vm.from, type: 1});
      }
      else if(vm.from == -2){//from order-detail
        $state.go("app.product-detail-comments-o",{id: vm.id, from: vm.from, type: 1})
      }
      else if(vm.from >=0){//from store-main
        $state.go("store.product-detail-comments",{id: vm.id, from: vm.from, type: 1})
      }
    }
    function toReputationCommentsPage(){
      if(vm.from == -1){//from main
        $state.go("app.product-detail-comments",{id: vm.id, from: vm.from, type: 0});
      }
      else if(vm.from == -2){//from order-detail
        $state.go("app.product-detail-comments-o",{id: vm.id, from: vm.from, type: 0})
      }
      else if(vm.from >=0){//from store-main
        $state.go("store.product-detail-comments",{id: vm.id, from: vm.from, type: 0})
      }
    }

    $scope.buttonReduceClick = function(){
      vm.count= Math.max(Number(vm.count)-1, 1);
    };
    $scope.buttonAddClick = function() {
      vm.count=Number(vm.count)+1;
    };
    function confirmComment(){
      Products.makeComment(vm.product.Product.id,vm.commentT.rating,vm.commentT.text,null).then(function(data){
        activate();
      });
    }
    vm.addToCart = function(toCart){
      $rootScope.ensureLogin().then(function(){
        Carts.addCartItem($stateParams.id, vm.count, vm.currentSpecs, 1, 0).then(function(result){
          Carts.getCartItems().then(function(result){
            $rootScope.updateCart(result);
            if(toCart){
              vm.showTabs();
              $state.go('app.cart');
            }
            else{
              $rootScope.alertMessage('商品添加成功。');
            }
          });
        }, function(e){$log.log("add to cart failed: ").log(e)});
      }, function(toLogin){
        $state.go('app.product-detail-account-login');
      });
    } 
  }
})(window, window.angular);





