(function ($window, angular) {
  "use strict";

  angular.module('module.others')
  .controller('OfflineStoresCtrl', OfflineStoresCtrl)

  function OfflineStoresCtrl($q, $state, $ionicHistory, $log, $scope, $rootScope, OfflineStores){
    var vm = this;
    vm.checkOfflineStore = checkOfflineStore;
    vm.chosePickups = chosePickups;
    activate();

    function activate() {
      vm.offlineStores = $rootScope.offlineStores['address'];
      var offlineStoresArr = _.map(vm.offlineStores, function(value,key){
        return key;
      });
      vm.validArea = getValidArea(offlineStoresArr);
      vm.activeArea = offlineStoresArr[0]||0;
    }
    function checkOfflineStore(value){
      _.each(vm.offlineStores, function(offlineStore){
        offlineStore.checked = (offlineStore.id == value.id);
      });
      $ionicHistory.goBack();
    }
    function chosePickups(key){
      vm.activeArea = key;
    }
    function getValidArea(offlineStoresArr){
      var beijingArea = OfflineStores.getBeijingArea();
      _.each(beijingArea,function(value,key){
        if(!_.contains(offlineStoresArr, key)){
          delete(beijingArea[key]);
        }
      });
      return beijingArea;
    }
  }
})(window, window.angular);