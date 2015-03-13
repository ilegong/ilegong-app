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
      vm.loading = true;
      vm.loaded = false;
      vm.loadFailed = false;

      vm.loadData();
    }

    function loadData(){
      return Stores.getStoreIntro($stateParams.id).then(function(data){
        vm.storeIntro = $sce.trustAsHtml(data.Brand.content);
        vm.loading = false;
        vm.loaded = true;
        vm.loadFailed = false;
      }, function(e){
        vm.loaded = false;
        vm.loading = false;
        vm.loadFailed = true;
      });
    }
  }
})(window, window.angular);