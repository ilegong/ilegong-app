(function (window, angular) {
  "use strict";

  angular.module('ilegong.home')
  .controller('HomeCategoryCtrl', HomeCategoryCtrl)

  function HomeCategoryCtrl($rootScope, $scope, $stateParams, $state, $log, $interval, Categories){
    var vm = this;
    vm.loadData = loadData;
    vm.getBrandById = getBrandById;
    vm.loadSeckills = loadSeckills;
    vm.setupCountDown = setupCountDown;
    vm.formatDate = formatDate;
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
          return seckill;
        });
      }).then(function(seckills){
        vm.seckills = seckills;
        _.each(vm.seckills, function(seckill){
          vm.setupCountDown(seckill);
        });
      });
    }
    function setupCountDown(seckill){
      if(seckill.ProductTry.status != 'sec_unstarted'){
        return;
      }

      if(_.isEmpty(seckill.timer)){
        seckill.timer = $interval(function() {
          seckill.ProductTry.remaining_time = seckill.ProductTry.remaining_time - 1;
          if(seckill.ProductTry.remaining_time <= 0){
            seckill.ProductTry.status = 'sec_kill';
            $interval.cancel(seckill.timer);
            seckill.timer = {};
            $rootScope.$broadcast('seckillStateChanged', seckill);
          }
        }, 1000);
      }
    }
    function formatDate(total){
      if(total < 0 || isNaN(total)){
        total = 0;
      }
      var hours = parseInt(total / 3600);
      var minutes = parseInt((total % 3600) / 60);
      var seconds = (total % 3600) - minutes * 60;
      return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }
    function getBuyTitle(product){
      if(!_.isEmpty(product.TuanBuying) && (product.TuanBuying.status == 'finished' || product.TuanBuying.status == 'canceled')){
        return '团购已结束';
      }
      return '立即购买';
    }
  }
})(window, window.angular);