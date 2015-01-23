(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailCommentCtrl', ProductDetailCommentCtrl)

  /* @ngInject */
  function ProductDetailCommentCtrl($q,$log,$rootScope, $scope, $stateParams,$http,Products,Carts,Addresses,Orders){
    var vm = this;
    vm.getEvaluateComment = function(){return _.filter(vm.comment.data,function(comment){return comment.Comment.is_shichi_tuan_comment != '1'})}
    vm.getShichiComment = function(){return _.filter(vm.comment.data,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'})}
    vm.getShichiCommentNum = function(){return _.countBy(vm.comment.data,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'?'num':'notshow'})['num']}
    vm.getEvaluateCommentNum = function(){return _.countBy(vm.comment.data,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'?'notshow':'num'})['num']}
    vm.isShowStar = function(comment,starIndex){return comment.Comment.rating > starIndex}  
    vm.getComment = function(){return vm.comment.flag == 0?vm.getEvaluateComment():vm.getShichiComment();}
    vm.setFlag = function(flag){vm.tabsActive = [false,false];vm.tabsActive[flag] = true;vm.comment.flag = flag;}

    activate();
    function activate(){
      vm.comment = $rootScope.productDetailComment;
      if(vm.comment.flag == 0){
        vm.tabsActive = [true,false];
      }
      else{
        vm.tabsActive = [false,true];
      }
    }
  }
})(window, window.angular);