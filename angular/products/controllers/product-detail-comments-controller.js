(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailCommentsCtrl', ProductDetailCommentsCtrl)

  /* @ngInject */
  function ProductDetailCommentsCtrl($log, $rootScope, $scope, $stateParams,Products){
    var vm = this;
    vm.getReputationComments = function(){return _.filter(vm.comments,function(comment){return comment.is_shichi_tuan_comment != '1'})}
    vm.geTyingComments = function(){return _.filter(vm.comments,function(comment){return comment.is_shichi_tuan_comment == '1'})}
    vm.isShowStar = function(comment, starIndex){return comment.rating > starIndex}  

    activate();
    function activate(){
      vm.id = $stateParams.id;
      vm.type = $stateParams.type;
      vm.comments = [];
      Products.getProductComment(vm.id).then(function(result){
        vm.comments = _.map(result, function(comment){return comment.Comment});
      }, function(e){$log.log(e)});
    }
  }
})(window, window.angular);