(function (window, angular) {
  "use strict";

  angular.module('ilegong.categories', [])
  .controller('CategoriesCtrl', CategoriesCtrl)
  .controller('CategoryDetailCtrl', CategoryDetailCtrl)

  /* @ngInject */
  function CategoriesCtrl($rootScope, $scope){
    $rootScope.hideTabs = false;
    $scope.categories = [
      new Category(1, '新鲜水果', '苹果/柠檬/橙子/石榴/梨', 'http://www.tongshijia.com/img/class/class3.jpg', 'http://51daifan-images.stor.sinaapp.com/files/201409/thumb_m/56653661417_0908.jpg'),
      new Category(2, '枣、干果', '枸杞/核桃/葡萄干/无花果/枣', 'http://www.tongshijia.com/img/class/class5.jpg', 'http://51daifan-images.stor.sinaapp.com/files/201409/thumb_m/56653661417_0908.jpg')
    ]
  }

  function CategoryDetailCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
    $scope.products = [
      new Product(1,'搜狐潘婷家的喀什灰枣君',40.00,0,'搜狐-潘婷','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201410/thumb_m/0e712bebad0_1004.jpg','http://www.tongshijia.com/products/20141117/xin_jiang_hui_zao.html',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
      new Product(2,'西域美农椒盐碧根果250g',25.99,64.50,'西域美侬-李春望','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/873270830e5_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201409/thumb_m/56653661417_0908.jpg','http://www.tongshijia.com/products/20141118/xi_yu_mei_nong_jiao_yan_bi_gen_guo_250g.html',true,'http://www.tongshijia.com/brands/20140908/xi_yu_mei_nong_li_chun_wang.html')
    ]
  }

})(window, window.angular);