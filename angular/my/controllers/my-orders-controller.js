(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log, $scope, $rootScope, $http, $stateParams, $timeout, Orders){
    var vm = this;
    vm.getOrderState = function(order){return Orders.getOrderState(order.Order.status)};
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    vm.addRemark = addRemark;
    vm.doRefresh = doRefresh;
    activate();
    
    function activate() {
      vm.state =$stateParams.state;
      vm.orderStateName = Orders.getOrderState(vm.state).name;
      vm.orders = _.filter($rootScope.orders.orders, function(order){return Orders.isOfStates(order, vm.state)});
      vm.brands = $rootScope.orders.brands;
      vm.order_carts = $rootScope.orders.order_carts;
      vm.ship_type = $rootScope.orders.ship_type;
      $rootScope.$on("orderStateChanged", function(event, order){
        $log.log("order " + order.Order.id + " state changed to " + order.Order.status);
        vm.orders = _.filter($rootScope.orders.orders, function(order){return Orders.isOfStates(order, vm.state)});
      });
    }
    function doRefresh(){
      Orders.list().then(function(data){
        $rootScope.orders = {orders: data.orders, brands: data.brands, order_carts: data.order_carts, ship_type: data.ship_type};
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    }
    vm.remove = function(id){
      Orders.remove(id).then(function(result){
        activate();
      });
    }
    function confirmReceivingGoods(order){
      if(order.Order.status != 2){
        $log.log("cannot confirm receiving goods for order " +  order.Order.id + " with state " + order.Order.status);
        return;
      }
      var orderId = order.Order.id;
      Orders.confirmReceivingGoods(orderId).then(function(result){
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