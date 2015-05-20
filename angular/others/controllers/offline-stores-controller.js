(function ($window, angular) {
  "use strict";

  angular.module('module.others')
  .controller('OfflineStoresCtrl', OfflineStoresCtrl)

  function OfflineStoresCtrl($q, $state, $ionicHistory, $log, $scope, $rootScope, OfflineStores){
    var vm = this;
    vm.checkOfflineStore = checkOfflineStore;
    activate();

    function activate() {
      vm.offlineStores = $rootScope.offlineStores;
    }
    function checkOfflineStore(value){
      _.each(vm.offlineStores, function(offlineStore){
        offlineStore.checked = (offlineStore.id == value.id);
      });
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);