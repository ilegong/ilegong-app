(function (window, angular) {
  "use strict";

  angular.module('ilegong.home')
  .controller('HomeCategoryCtrl', HomeCategoryCtrl)

  function HomeCategoryCtrl($rootScope, $scope, $stateParams, $state, $log, Categories){
    var vm = this;
    vm.loadData = loadData;
    vm.getBrandById = getBrandById;
    vm.toDetailPage = toDetailPage;
    active();

    function active(){
      vm.tagId = _.isEmpty($stateParams.tagId) ? 23 : $stateParams.tagId; 
      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }
    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      if(vm.tagId == 23){
        Categories.getSeckills().then(function(data){
          vm.seckills = _.map(data, function(seckill){
            seckill.ProductTry.sold_num = Math.min(seckill.ProductTry.sold_num, seckill.ProductTry.limit_num);
            seckill.ProductTry.sold_percent = Math.min(seckill.ProductTry.sold_num / seckill.ProductTry.limit_num * 100, 100);
            return seckill;
          });
        });
      }
      else{
        vm.seckills = [];
      }

      return Categories.getProducts(vm.tagId).then(function(data){
        vm.brands = data.brands;
        vm.products = _.map(data.products, function(product){
          product.brand = vm.getBrandById(product.Product.brand_id);
          return product;
        });
        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
    }
    function getBrandById(id){
      return _.find(vm.brands, function(brand){return brand.Brand.id == id});
    }
    function toDetailPage(product){
      if(_.isEmpty(product.TuanBuying)){
        $state.go("product-detail", {id: product.Product.id,from:-1})
      }
      else{
        $state.go("tuanbuying-detail", {id: product.TuanBuying.id});
      }
    };
  }
})(window, window.angular);