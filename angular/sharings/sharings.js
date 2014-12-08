(function (window, angular) {
  "use strict";

  angular.module('ilegong.sharings', ['app.services'])
  .controller('SharingsCtrl', SharingsCtrl)
  .controller('SharingDetailCtrl', SharingDetailCtrl)

  /* @ngInject */
  function SharingsCtrl($rootScope, $scope, Brands){
    $rootScope.hideTabs = false;
    var vm = this;
    activate();
    
    function activate(){
      Brands.list().then(function(data){
        vm.brands = data.brands;
      });
    }
  }

  /* @ngInject */
  function SharingDetailCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
    $scope.sharing = new Sharing(1, '阿里巴巴', '李瑞', 'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html', 'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/858bbafb0fb_1117.jpg')
  }

})(window, window.angular);