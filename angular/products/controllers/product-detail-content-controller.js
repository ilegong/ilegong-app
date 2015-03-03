(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailContentCtrl', ProductDetailContentCtrl)

  /* @ngInject */
  function ProductDetailContentCtrl($state,$ionicPopup,$q,$log,$rootScope, $scope, $stateParams,$http,Products,Carts,Addresses,Orders){
    var vm = this;
    activate();
    
    function activate(){
      vm.id = $stateParams.id;
      Products.getProductContent(vm.id).then(function(data){
        vm.content = data.content;
      }, function(e){$log.log(e)});
    }
  }
})(window, window.angular);