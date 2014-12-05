(function (window, angular) {
  "use strict";

  angular
  .module('ilegong.home', ['app.services'])
  .controller('HomeCtrl', HomeCtrl)
  
  /* @ngInject */
  function HomeCtrl($rootScope, $scope, $http, $log, Products){
    $rootScope.hideTabs = false;
    var vm = this;
    active();

    $scope.SlideBoxItems = [
                            new SlideBoxItem('http://51daifan.sinaapp.com/img/banner/pyshuo_banner_fengli.jpg','http://www.tongshijia.com/products/20140809/tai_wan_tu_feng_li_su.html'),
                            new SlideBoxItem('http://51daifan.sinaapp.com/img/banner/pyshuo_banner_follower.jpg','http://www.tongshijia.com/products/20140903/qing_hai_hu_hua_fen.html'),
                            new SlideBoxItem('http://51daifan.sinaapp.com/img/banner/pyshuo_banner_follower.jpg','http://www.tongshijia.com/products/20140903/qing_hai_hu_hua_fen.html')
                            ];

    function active(){
      Products.list().then(function(data){
        vm.slideBoxItems = [];
        vm.brands = data.brands;
        vm.tagsWithProducts = data.tagsWithProducts;
      });
    }
  }
})(window, window.angular);