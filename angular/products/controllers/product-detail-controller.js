(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($state, $ionicPopup, $q, $log, $rootScope, $scope, $stateParams,$http,$filter, $sce, Products,Carts,Addresses,Orders){
    var vm = this;
    vm.loadData = loadData;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.confirmComment = confirmComment;
    vm.isShowStar = function(comment,starIndex){return comment.Comment.rating > starIndex}  
    vm.commentT = {rating:5,text:'',images:[]};
    vm.isShowMakeCommentStar = function(index){return vm.commentT.rating > index}
    vm.specsClick = specsClick;
    vm.hasSpecs = hasSpecs;
    vm.getReputationComments = function(){return _.filter(vm.comments,function(comment){return comment.Comment.is_shichi_tuan_comment != '1'})}
    vm.getTryingComments = function(){return _.filter(vm.comments,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'})}
    vm.toTryingCommentsPage = toTryingCommentsPage;
    vm.toReputationCommentsPage = toReputationCommentsPage;
    vm.addToCart = addToCart;
    vm.buyImmediately = buyImmediately;
    vm.onActionFailed = onActionFailed;
    vm.readyToBuy = readyToBuy;
    vm.toCartPage = function(){$rootScope.hideTabs = []; $state.go('app.cart');};
    vm.getCartTitle = getCartTitle;
    vm.getShipFee = getShipFee;
    vm.trustAsHtml = trustAsHtml;
    activate();
    
    function activate(){
      vm.count=1;
      vm.id = $stateParams.id;
      vm.from = $stateParams.from;
      vm.rating = 5;
      vm.showProductIntro = false;
      vm.specsChecks = {};
      vm.currentSpecs = 0;
      vm.inprogress = false;

      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }

    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Products.getProduct(vm.id).then(function(data){
        vm.product = data.product;
        if(!_.isEmpty(vm.product.Product.specs)){
          try{
            vm.product.Product.specs = JSON.parse(vm.product.Product.specs);            
          }catch(e){
            $log.log('product ' + vm.id + ' specs is invalid: ' + vm.product.Product.specs, true);
          }
        }
        vm.recommends = _.pairs(data.recommends);
        vm.brand = data.brand;
        vm.hasWeixinId = !_.isEmpty(vm.brand.Brand.weixin_id);
        vm.comments = [];

        Products.getProductComment(vm.id).then(function(comments){
          vm.comments = comments;
        });

        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
    }
    function specsClick(specType, specChoice){
      _.each(vm.specsChecks[specType], function(specChoice){specChoice.value = false});
      vm.specsChecks[specType][specChoice].value = true;
      vm.currentSpecs = _.findKey(vm.product.Product.specs.map, function(value, key){return value.name == specChoice});
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
      if(vm.inprogress){
        return false;
      }
      return true;
    }
    function addToCart(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      vm.inprogress = true;
      Carts.addCartItem(vm.id, vm.count, vm.currentSpecs, 1, 0, $rootScope.user.token.access_token).then(function(result){
        vm.inprogress = false;
        $rootScope.reloadCart($rootScope.user.token.access_token);
        $rootScope.alertMessage('商品添加成功');
      }, function(e){
        vm.onActionFailed('添加到购物车失败，请重试', e);
      });
    }
    function buyImmediately(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      vm.inprogress = true;
      var couponCode = '';
      Carts.addCartItem(vm.id, vm.count, vm.currentSpecs, 1, 0, $rootScope.user.token.access_token).then(function(result){
        $rootScope.confirmCart([vm.id], couponCode, $rootScope.user.token.access_token).then(function(){
          vm.inprogress = false;
          $state.go('cart-confirmation');
        }, function(e){
          $log.log('confirm cart failed:').log(e);
          vm.onActionFailed('购买失败，请重试', e);
        });
      }, function(e){
        $log.log('add to cart failed:').log(e);
        vm.onActionFailed('购买失败，请重试', e);
      });
    }
    function onActionFailed(message){
      vm.inprogress = false;
      $rootScope.alertMessage(message);
    }
    function getCartTitle(){
      if(_.isEmpty(vm.product) || _.isEmpty(vm.product.Product)){
        return '加入购物车';
      }
      if(!vm.product.Product.published){
        return '该商品已下架';
      }
      if(vm.product.Product.limit_ship){
        return '不支持购物车';
      }
      return '加入购物车';
    }
    function getShipFee(){
      if(_.isEmpty(vm.product)){
        return '';
      }
      if(vm.product.Product.ship_fee == -1){
        return '货到付款';
      }
      else if(vm.product.Product.ship_fee == -2){
        return '自提';
      }
      else if(vm.product.Product.ship_fee == 0){
        return '包邮';
      }
      return $filter('currency')(vm.product.Product.ship_fee, '￥');
    }
    function trustAsHtml(string){
      return $sce.trustAsHtml(string);
    }
  }
})(window, window.angular);