(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreIntroCtrl', StoreIntroCtrl)

  /* @ngInject */
  function StoreIntroCtrl($rootScope, $scope, $stateParams, $sce, Stores){
    var vm = this;
    vm.loadData = loadData;
    activate();
    function activate(){
      $rootScope.storeId = $stateParams.id;
      $rootScope.storeName = $stateParams.name;

      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }

    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Stores.getStoreIntro($stateParams.id).then(function(data){
        vm.storeIntro = $sce.trustAsHtml(data.Brand.content);
        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
    }
  }
})(window, window.angular);