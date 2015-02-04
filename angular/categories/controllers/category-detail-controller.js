(function (window, angular) {
  "use strict";

  angular.module('ilegong.categories')
  .controller('CategoryDetailCtrl', CategoryDetailCtrl)

  function CategoryDetailCtrl($rootScope, $scope, $stateParams, $state, $log, Categories){
    var vm = this;
    vm.doRefresh = doRefresh;
    vm.getBrandById = getBrandById;
    vm.toProductDetailPage = function(product){$state.go("app.product-detail.intro", {id: product.id,from:-1})};
    active();

    function active(){
      vm.slug = $stateParams.slug;
      vm.brands = $rootScope.brands;
      // ionic bug: http://stackoverflow.com/questions/21257786/angularjs-using-ionic-framework-data-binding-on-header-title-not-working
      vm.name = $stateParams.name;
      Categories.get(vm.slug).then(function(data){
        vm.products = _.map(data.data_list, function(product){product.brand = vm.getBrandById(product.brand_id); return product});
      });
    }
    function doRefresh(){
      Categories.get(vm.slug).then(function(data){
        vm.products = data.data_list;
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
    function getBrandById(id){
      return _.find(vm.brands, function(brand){return brand.Brand.id == id});
    }
  }
})(window, window.angular);