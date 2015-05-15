(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('TuanBuyingDetailCtrl', TuanBuyingDetailCtrl)

  /* @ngInject */
  function TuanBuyingDetailCtrl($state, $ionicPopup, $q, $log, $rootScope, $scope, $stateParams,$http,$filter, $sce, Base, Products,Carts,Addresses,Orders){
    var vm = this;
    activate();
    
    function activate(){
      vm.id = $stateParams.id;
      
      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }

    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Products.getProduct(vm.id).then(function(data){

        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
    }
  }
})(window, window.angular);