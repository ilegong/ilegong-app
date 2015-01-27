(function (window, angular) {
  "use strict";

  angular.module('ilegong.categories', ['module.services'])
  .controller('CategoriesCtrl', CategoriesCtrl)
  .controller('CategoryDetailCtrl', CategoryDetailCtrl)

  /* @ngInject */
  function CategoriesCtrl($rootScope, $scope){
    $scope.categories = [
      new Category(1, '新鲜水果', '苹果/柠檬/橙子/石榴/梨', 'http://www.tongshijia.com/img/class/class3.jpg', 'http://51daifan-images.stor.sinaapp.com/files/201409/thumb_m/56653661417_0908.jpg'),
      new Category(2, '枣、干果', '枸杞/核桃/葡萄干/无花果/枣', 'http://www.tongshijia.com/img/class/class5.jpg', 'http://51daifan-images.stor.sinaapp.com/files/201409/thumb_m/56653661417_0908.jpg')
    ]
  }
  
  function CategoryDetailCtrl($rootScope, $scope, $stateParams, $log, Categories){
    var vm = this;
    active();
    vm.doRefresh = doRefresh;
    function active(){
      vm.slug = $stateParams.slug;
      Categories.get(vm.slug).then(function(data){
        vm.brands = data.brands;
        vm.products = data.data_list;
        vm.sub_title = data.sub_title;
      });
    }
    function doRefresh(){
      Categories.get(vm.slug).then(function(data){
        vm.brands = data.brands;
        vm.products = data.data_list;
        vm.sub_title = data.sub_title;
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
  }


})(window, window.angular);