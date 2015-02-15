(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($state,$ionicPopup,$q,$log,$rootScope, $scope, $stateParams,$http,Products,Carts,Addresses,Orders){
    var vm = this;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.confirmComment = confirmComment;
    vm.isShowStar = function(comment,starIndex){return comment.Comment.rating > starIndex}  
    vm.commentT = {rating:5,text:'',images:[]};
    vm.isShowMakeCommentStar = function(index){return vm.commentT.rating > index}
    vm.specsClick = specsClick;
    vm.hasSpecs = hasSpecs;
    vm.getReputationComments = function(){return _.filter(vm.comment,function(comment){return comment.Comment.is_shichi_tuan_comment != '1'})}
    vm.getTryingComments = function(){return _.filter(vm.comment,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'})}
    vm.toTryingCommentsPage = toTryingCommentsPage;
    vm.toReputationCommentsPage = toReputationCommentsPage;
    vm.addToCart = addToCart;
    vm.buyImmediately = buyImmediately;
    vm.readyToBuy = readyToBuy;
    vm.toCartPage = function(){$rootScope.hideTabs = []; $state.go('app.cart');};
    activate();
    
    function activate(){
      vm.count=1;
      vm.id = $stateParams.id;
      vm.from = $stateParams.from;
      vm.rating = 5;
      vm.showProductIntro = false;
      vm.specsChecks = {};
      vm.currentSpecs = 0;
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
    function hasSpecs(){
      if(_.isEmpty(vm.product)){
        return false;
      }
      if(_.isEmpty(vm.product.Product.specs) || _.isEmpty(vm.product.Product.specs.choices)){
        return false;
      }
      return _.any(vm.product.Product.specs.choices, function(value, key){return value.length > 1});
    }

    function toTryingCommentsPage(){
      $state.go("product-detail-comments", {id: vm.id, from: vm.from, type: 1});
    }
    function toReputationCommentsPage(){
      if(vm.getReputationComments().length == 0){
        return;
      }
      $state.go("product-detail-comments",{id: vm.id, from: vm.from, type: 0});
    }

    function reduceCartItemNum(){
      vm.count= Math.max(vm.count - 1, 1);
    };
    function addCartItemNum() {
      vm.count = Math.min(vm.count + 1, 9999);
    };
    function confirmComment(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      Products.makeComment(vm.product.Product.id,vm.commentT.rating,vm.commentT.text,null, $rootScope.user.token.access_token).then(function(data){
        activate();
      });
    }
    function readyToBuy(){
      if(Number(vm.count) !== vm.count && vm.count %1 !==0){
        return false;
      }
      if(vm.hasSpecs() && vm.currentSpecs == 0){
        return false;
      }
      return true;
    }
    function addToCart(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      Carts.addCartItem($stateParams.id, vm.count, vm.currentSpecs, 1, 0, $rootScope.user.token.access_token).then(function(result){
        $rootScope.reloadCart($rootScope.user.token.access_token);
        $rootScope.alertMessage('商品添加成功。');
      }, function(e){
        $log.log('add to cart failed: ').log(e);
        $rootScope.alertMessage('添加到购物车失败，请重试');
      });
    }
    function buyImmediately(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      var couponCode = '';
      $rootScope.getCartInfo($stateParams.id, couponCode, $rootScope.user.token.access_token).then(function(){
        $state.go('cart-confirmation');
      }, function(e){
        $rootScope.alertMessage(vm.confirmErrors[e.reason] || '结算失败，请重试');
        $ionicHistory.goBack();
      });
    } 
  }
})(window, window.angular);