(function ($window, angular) {
  "use strict";

  angular.module('module.others')
  .controller('OfflineStoresCtrl', OfflineStoresCtrl)

  function OfflineStoresCtrl($q, $state, $ionicHistory, $log, $scope, $rootScope,$stateParams, OfflineStores){
    var vm = this;
    vm.choseAreas = choseAreas;
    vm.checkPickup = checkPickup;
    vm.defaultPickup = $rootScope.user.offlineStores;
    activate();

    function activate() {
      vm.state= $stateParams.state;
      vm.shippment = new Shippment( true , $rootScope.offlineStores, vm.state);
      vm.offlineStores = _.groupBy(vm.shippment.pickups, function(pickup) {
        return pickup.area_id;
      });
      var offlineStoresArr = _.map(vm.offlineStores, function(value,key){
        return key;
      });
      vm.validArea = getValidArea(offlineStoresArr);
      vm.activeArea = offlineStoresArr[0]||0;
      vm.pickups = vm.offlineStores[vm.activeArea];
    }
    function choseAreas(key){
      vm.activeArea = key;
      vm.pickups = vm.offlineStores[vm.activeArea];
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
    function checkPickup(value) {
      vm.shippment.checkPickup(value);
      if(vm.defaultPickup.ziti_id != value.id){
        vm.defaultPickup.address = value.name;
        vm.defaultPickup.area = value.area_id;
        vm.defaultPickup.ziti_id= value.id;
        vm.defaultPickup.ziti_type= value.type;
        vm.defaultPickup.changed = true;
      }
      $rootScope.$broadcast("offlineStoreChanged");
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);