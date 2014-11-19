(function (window, angular) {
  "use strict";

  angular.module('ilegong.categories', [])
  .controller('CategoriesCtrl', CategoriesCtrl)

  /* @ngInject */
  function CategoriesCtrl($scope){
    $scope.categories = [
      new Category(1, '新鲜水果', '苹果/柠檬/橙子/石榴/梨', 'http://www.tongshijia.com/categories/tag/shuiguoganguo.html', 'http://www.tongshijia.com/img/class/class3.jpg'),
      new Category(2, '枣、干果', '枸杞/核桃/葡萄干/无花果/枣', 'http://www.tongshijia.com/categories/tag/xiaochilingshi.html', 'http://www.tongshijia.com/img/class/class5.jpg')
    ]
  }

})(window, window.angular);