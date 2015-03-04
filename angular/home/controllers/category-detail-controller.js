(function (window, angular) {
  "use strict";

  angular.module('ilegong.home')
  .controller('HomeCategoryCtrl', HomeCategoryCtrl)

  function HomeCategoryCtrl($rootScope, $scope, $stateParams, $state, $log, Categories){
    var vm = this;
    vm.doRefresh = doRefresh;
    vm.getBrandById = getBrandById;
    vm.getItemHeight = getItemHeight;
    vm.getItemWidth = getItemWidth;
    vm.toProductDetailPage = function(product){$log.log('to product detail page');$state.go("product-detail", {id: product.id,from:-1})};
    active();

    function active(){
      vm.slug = $stateParams.slug;
      vm.brands = $rootScope.brands;
      // ionic bug: http://stackoverflow.com/questions/21257786/angularjs-using-ionic-framework-data-binding-on-header-title-not-working
      vm.name = $stateParams.name;

      var deviceWidth = window.innerWidth;
      vm.itemWidth = (window.innerWidth - 10) / 2;
      vm.imageHeight = Math.max((vm.itemWidth - 10) * 3 / 4, 10);
      var brandHeight = 40;
      var productNameHeight = 20;
      vm.itemHeight = Math.ceil(vm.imageHeight + brandHeight + productNameHeight + 10 + 7 + 6);
      $log.log("vm.imageHeight: " + vm.imageHeight +", itemHeight:" + vm.itemHeight);

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
    function getItemHeight(){
      return vm.itemHeight + 'px';
    }
    function getItemWidth(){
      return vm.itemWidth + 'px';
    }
  }
})(window, window.angular);