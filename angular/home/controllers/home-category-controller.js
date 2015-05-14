(function (window, angular) {
  "use strict";

  angular.module('ilegong.home')
  .controller('HomeCategoryCtrl', HomeCategoryCtrl)

  function HomeCategoryCtrl($rootScope, $scope, $stateParams, $state, $log, Categories){
    var vm = this;
    vm.loadData = loadData;
    vm.getBrandById = getBrandById;
    vm.toProductDetailPage = function(product){$state.go("product-detail", {id: product.id,from:-1})};
    active();

    function active(){
      vm.tagId = $stateParams.tagId; 
      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }
    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Categories.getProducts(vm.tagId).then(function(data){
        vm.products = _.map(data.data_list, function(product){product.brand = vm.getBrandById(product.brand_id); return product});
        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
    }
    function getBrandById(id){
      return _.find(vm.brands, function(brand){return brand.Brand.id == id});
    }
  }
})(window, window.angular);