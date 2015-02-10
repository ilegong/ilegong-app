(function (window, angular) {
  "use strict";

  angular
  .module('ilegong.home')
  .controller('HomeMainCtrl', HomeMainCtrl)
  
  /* @ngInject */
  function HomeMainCtrl(Users,$rootScope, $scope, $http, $log, $timeout, $ionicSlideBoxDelegate, Base){
    var vm = this;
    vm.doRefresh = doRefresh;
    activate();

    function activate(){
      vm.loading = true;
      vm.loaded = false;
      vm.loadingFailed = false;
      vm.doRefresh();
    }
    function doRefresh(){
      if(vm.loaded){
        return;
      }
      vm.loading = true;
      vm.loadingFailed = false;
      Base.get('/api_orders/home.json').then(function(data){
        vm.bannerItems = _.filter(data.bannerItems, function(item){return item.id != null});
        vm.tryingItems = data.tryingItems;
        vm.specTagItems = data.specTagItems;
        vm.mainTagItems = data.mainTagItems;
        vm.hotItems = data.hotItems;
        // see http://forum.ionicframework.com/t/slides-generated-with-ng-repeat-causing-issues-slide-box/394/7
        $ionicSlideBoxDelegate.update();
        vm.loading = false;
        vm.loaded = true;
        vm.loadingFailed = false;
        $rootScope.activate();
        $log.log('get home.json succeeded: ').log(data);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      }, function(e){
        $log.log('get home.json failed: ').log(e);
        vm.loaded = false;
        vm.loading = false;
        vm.loadingFailed = true;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      });
    }
  }
})(window, window.angular);