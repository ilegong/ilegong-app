(function (window, angular) {
  "use strict";

  angular.module('ilegong.home')
  .controller('HomeCategoryCtrl', HomeCategoryCtrl)

  function HomeCategoryCtrl($rootScope, $scope, $stateParams, $state, $log, $interval, Categories){
    var vm = this;
    vm.loadData = loadData;
    vm.getBrandById = getBrandById;
    vm.loadSeckills = loadSeckills;
    vm.toDetailPage = toDetailPage;
    vm.getBuyTitle = getBuyTitle;
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
      vm.loadSeckills();

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
      if(!_.isEmpty(product.TuanBuying)){
        $state.go("product-detail", {id: product.Product.id, type: 5, value: product.TuanBuying.id});
      }
      else if(!_.isEmpty(product.ProductTry)){
        $state.go("product-detail", {id: product.Product.id, type: 6, value: product.ProductTry.id});
      }
      else{
        $state.go("product-detail", {id: product.Product.id, type: 1, value: product.Product.id});
      }
    }
    function loadSeckills(){
      if(vm.tagId != 23){
        return [];
      }

      return Categories.getSeckills().then(function(data){
        return _.map(data, function(seckill){
          seckill.ProductTry.sold_num = Math.min(seckill.ProductTry.sold_num, seckill.ProductTry.limit_num);
          seckill.ProductTry.sold_percent = Math.min(seckill.ProductTry.sold_num / seckill.ProductTry.limit_num * 100, 100);
          $rootScope.$broadcast('seckillChanged', seckill);
          return seckill;
        });
      }).then(function(seckills){
        vm.seckills = seckills;
        var allSeckillsFinished = _.all(vm.seckills, function(seckill){return seckill.status == 'sec_end'});
        if(allSeckillsFinished){
          if(!_.isEmpty(vm.timer)){
            $log.log('cancel seckill timer: ').log(seckills);
            $interval.cancel(vm.timer);
          }
        }
        else{
          if(_.isEmpty(vm.timer)){
            $log.log('setup seckill timer: ').log(seckills);
            vm.timer = $interval(function() {
              vm.loadSeckills();
            }, 10000);
          }
        }
      });
    }
    function getBuyTitle(product){
      if(!_.isEmpty(product.TuanBuying) && (product.TuanBuying.status == 'finished' || product.TuanBuying.status == 'canceled')){
        return '团购已结束';
      }
      return '立即购买';
    }
  }
})(window, window.angular);