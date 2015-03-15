(function (window, angular, navigator) {
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
      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }
    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Base.get('/api_orders/home.json').then(function(data){
        vm.bannerItems = _.filter(data.bannerItems, function(item){return item.id != null});
        vm.tryingItems = data.tryingItems;
        vm.specTagItems = data.specTagItems;
        vm.mainTagItems = data.mainTagItems;
        vm.hotItems = data.hotItems;
        // see http://forum.ionicframework.com/t/slides-generated-with-ng-repeat-causing-issues-slide-box/394/7
        $ionicSlideBoxDelegate.update();

        vm.loadStatus.succeeded();
        $rootScope.hideTabs = [false];
        $rootScope.refreshData();
      }, function(e){
        vm.loadStatus.failed(e.status);
        $rootScope.hideTabs = [true];
      }).finally(function(){
        // see: http://forum.ionicframework.com/t/white-page-showing-after-splash-screen-before-app-load/2908/16
        $timeout(function(){
          if(navigator && navigator.splashscreen && navigator.splashscreen.hide){
            navigator.splashscreen.hide();            
          }
        }, 1000);
      });
    }
  }
})(window, window.angular, window.navigator);