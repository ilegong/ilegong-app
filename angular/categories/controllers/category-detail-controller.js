(function (window, angular) {
  "use strict";

  angular.module('ilegong.categories')
  .controller('CategoryDetailCtrl', CategoryDetailCtrl)

  function CategoryDetailCtrl($rootScope, $scope, $stateParams, $log, Categories){
    var vm = this;
    vm.doRefresh = doRefresh;
    active();

    function active(){
      vm.slug = $stateParams.slug;
      // ionic bug: http://stackoverflow.com/questions/21257786/angularjs-using-ionic-framework-data-binding-on-header-title-not-working
      vm.name = $stateParams.name;
      Categories.get(vm.slug).then(function(data){
        vm.brands = data.brands;
        vm.products = data.data_list;
        vm.name = data.sub_title;
      });
    }
    function doRefresh(){
      Categories.get(vm.slug).then(function(data){
        vm.brands = data.brands;
        vm.products = data.data_list;
        vm.name = data.sub_title;
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
  }
})(window, window.angular);