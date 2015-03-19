(function (window, angular) {
  "use strict";

  angular.module('ilegong.home')
  .controller('HomeCategoryCtrl', HomeCategoryCtrl)

  function HomeCategoryCtrl($rootScope, $scope, $stateParams, $state, $log, Categories){
    var vm = this;
    vm.loadData = loadData;
    vm.getBrandById = getBrandById;
    vm.getItemHeight = getItemHeight;
    vm.getItemWidth = getItemWidth;
    vm.toProductDetailPage = function(product){$state.go("product-detail", {id: product.id,from:-1})};
    active();

    function active(){
      vm.slug = $stateParams.slug;
      vm.brands = $rootScope.brands;
      // ionic bug: http://stackoverflow.com/questions/21257786/angularjs-using-ionic-framework-data-binding-on-header-title-not-working
      vm.name = $stateParams.name;

      var deviceWidth = window.innerWidth;
      vm.itemWidth = Math.round((window.innerWidth - 10) / 2);
      vm.imageWidth = vm.itemWidth - 10 - 2; // 2px border
      vm.imageHeight = Math.round(vm.imageWidth * 3 / 4); 
      var productNameHeight = 18;
      var brandHeight = 40;
      vm.itemHeight = Math.ceil(vm.imageHeight + brandHeight + productNameHeight + 22); // 10px padding + 10px divider + 2px border
      
      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }
    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Categories.get(vm.slug).then(function(data){
        vm.products = _.map(data.data_list, function(product){product.brand = vm.getBrandById(product.brand_id); return product});
        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
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