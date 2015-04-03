(function (window, angular, navigator) {
  "use strict";

  angular
  .module('ilegong.home')
  .controller('HomeMainCtrl', HomeMainCtrl)
  
  /* @ngInject */
  function HomeMainCtrl(Users,$rootScope, $scope, $http, $log, $timeout, $ionicSlideBoxDelegate, Base){
    var vm = this;
    vm.loadData = loadData;
    vm.get = get;
    vm.hideSplashScreen = hideSplashScreen;
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
      return vm.get('/api_orders/home.json').then(function(data){
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
          vm.hideSplashScreen();
        }, 1000);
      });
    }
    function hideSplashScreen(){
      if(navigator && navigator.splashscreen && navigator.splashscreen.hide){
        navigator.splashscreen.hide();            
      }
    }
    function get(url){
      var data = {"bannerItems":[{"img":"img/banner/spring-weixin.jpg","id":null},{"img":"img/banner/banner_cao_mei_cai_zhai.jpg","id":705}],"tryingItems":[],"specTagItems":[{"id":13,"name":"\u8d85\u503c\u8d2d","slug":"chao-zhi-gou","img":"img/mobile/index/p1.jpg"},{"id":14,"name":"\u4e0b\u5348\u8336","slug":"xia-wu-cha","img":"img/mobile/index/p2.jpg"},{"id":15,"name":"\u56de\u5bb6\u5403\u996d","slug":"hui-jia-chi-fang","img":"img/mobile/index/p3.jpg"}],"mainTagItems":[{"id":3,"name":"\u65b0\u9c9c\u6c34\u679c","slug":"shuiguoganguo","img":"img/mobile/index/c1.jpg"},{"id":5,"name":"\u4f11\u95f2\u96f6\u98df","slug":"xiaochilingshi","img":"img/mobile/index/c2.jpg"},{"id":8,"name":"\u86cb\u7cd5\u751c\u70b9","slug":"dangaotiandian","img":"img/mobile/index/c3.jpg"},{"id":12,"name":"\u5357\u5317\u5e72\u8d27","slug":"chu-fang-tiao-wei","img":"img/mobile/index/c4.jpg"},{"id":9,"name":"\u7cae\u6cb9\u526f\u98df","slug":"lianyoumimian","img":"img/mobile/index/c5.jpg"},{"id":6,"name":"\u9152\u6c34\u8336\u996e","slug":"jiushuichayin","img":"img/mobile/index/c6.jpg"},{"id":4,"name":"\u8089\u79bd\u86cb\u54c1","slug":"liangyou","img":"img/mobile/index/c7.jpg"},{"id":10,"name":"\u6c34\u4ea7\u6d77\u9c9c","slug":"shuichanhaixian","img":"img/mobile/index/c8.jpg"}],"hotItems":[{"img":"img/mobile/index/d4.jpg","id":705},{"img":"img/mobile/index/d1.jpg","id":818},{"img":"img/mobile/index/d2.jpg","id":826},{"img":"img/mobile/index/d3.jpg","id":253},{"img":"img/mobile/index/d5.jpg","id":283}]};
      return Base.deferred(data);
    }
  }
})(window, window.angular, window.navigator);