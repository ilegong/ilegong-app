(function (window, angular) {
  "use strict";

  angular.module('ilegong.sharings', [])
  .controller('SharingsCtrl', SharingsCtrl)

  /* @ngInject */
  function SharingsCtrl($scope){
    $scope.sharings = [
      new Sharing(1, '阿里巴巴', '李瑞', 'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html', 'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/858bbafb0fb_1117.jpg'), 
      new Sharing(2, '山西核桃', '刘富明', 'http://www.tongshijia.com/brands/20141117/shan_xi_he_tao_liu_fu_ming.html', 'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/ee4ff13b4d8_1117.jpg')
    ]
  }

})(window, window.angular);