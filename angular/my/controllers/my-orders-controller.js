(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log, $scope, $rootScope, $http, $stateParams, $timeout, Orders){
    var vm = this;
    vm.getOrderState = function(order){return Orders.getOrderState(order.Order.status)};
    vm.getBrand = function(brandId){return _.find(vm.brands, function(brand){return brand.Brand.id == brandId})};
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    vm.addRemark = addRemark;
    vm.doRefresh = doRefresh;
    activate();
    
    function activate() {
      vm.state =$stateParams.state;
      vm.orderStateName = Orders.getOrderState(vm.state).name;
      vm.orders = _.filter($rootScope.user.orders, function(order){return Orders.isOfStates(order, vm.state)});
      vm.brands = $rootScope.brands;
      $log.log('all brands:').log(vm.brands);
      vm.order_carts = $rootScope.user.order_carts;
      vm.ship_type = $rootScope.user.ship_type;
      $rootScope.$on("orderStateChanged", function(event, order){
        $log.log("order " + order.Order.id + " state changed to " + order.Order.status);
        vm.orders = _.filter($rootScope.user.orders, function(order){return Orders.isOfStates(order, vm.state)});
      });
    }
    function doRefresh(){
      $rootScope.reloadOrders($rootScope.user.token.access_token);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
    vm.remove = function(id){
      if(!$rootScope.user.loggedIn){
        return $state.go('app.my-account-login');
      }

      Orders.remove(id, $rootScope.user.token.access_token).then(function(result){
        activate();
      });
    }
    function confirmReceivingGoods(order){
      if(!$rootScope.user.loggedIn){
        return $state.go('app.my-account-login');
      }
      if(order.Order.status != 2){
        $log.log("cannot confirm receiving goods for order " +  order.Order.id + " with state " + order.Order.status);
        return;
      }
      var orderId = order.Order.id;
      Orders.confirmReceivingGoods(orderId, $rootScope.user.token.access_token).then(function(result){
        $rootScope.updateOrderState(orderId, 3);
        $rootScope.alertMessage("已确认收货");
      });
    }
    function viewLogistics(id){
    }
    function addRemark(order){
    }
    function remindSendingGoods(order){
      order.reminded = true;
      $timeout(function(){
        $rootScope.alertMessage('已经提醒卖家发货');
      }, 500);
    }
  }
})(window, window.angular);