(function (window, angular) {
  "use strict";

  angular
  .module('ilegong.home')
  .controller('HomeMainCtrl', HomeMainCtrl)
  
  /* @ngInject */
  function HomeMainCtrl(Users,$rootScope, $scope, $http, $log, $timeout, $ionicSlideBoxDelegate, Base){
    var vm = this;
    vm.loadData = loadData;
    activate();

    function activate(){
      vm.loading = true;
      vm.loaded = false;
      vm.loadFailed = false;
      vm.loadData();
    }
    function loadData(){
      if(vm.loaded){
        return;
      }
      vm.loading = true;
      return Base.get('/api_orders/home.json').then(function(data){
        vm.bannerItems = _.filter(data.bannerItems, function(item){return item.id != null});
        vm.tryingItems = data.tryingItems;
        vm.specTagItems = data.specTagItems;
        vm.mainTagItems = data.mainTagItems;
        vm.hotItems = data.hotItems;
        // see http://forum.ionicframework.com/t/slides-generated-with-ng-repeat-causing-issues-slide-box/394/7
        $ionicSlideBoxDelegate.update();
        vm.loading = false;
        vm.loaded = true;
        vm.loadFailed = false;

        $rootScope.hideTabs = [false];
        $rootScope.refreshData();
      }, function(e){
        vm.loaded = false;
        vm.loading = false;
        vm.loadFailed = true;

        $rootScope.hideTabs = [true];
      });
    }
  }
})(window, window.angular);