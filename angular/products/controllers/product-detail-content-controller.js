(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailContentCtrl', ProductDetailContentCtrl)

  /* @ngInject */
  function ProductDetailContentCtrl($state, $stateParams, $rootScope, $scope,$http, $sce, Products){
    var vm = this;
    activate();
    
    function activate(){
      vm.id = $stateParams.id;
      Products.getProductContent(vm.id).then(function(data){
        vm.content = data.content;
        vm.content.Product.content = $sce.trustAsHtml(vm.content.Product.content);
      }, function(e){$log.log(e)});
    }
  }
})(window, window.angular);