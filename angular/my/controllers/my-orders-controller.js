(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log, $scope, $rootScope, $http, $stateParams, $timeout, Orders){
    var vm = this;
    vm.getOrderState = function(order){return Orders.getOrderState(order.Order.status)};
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.onGoodsReceived = onGoodsReceived;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    activate();
    
    function activate() {
      vm.state =$stateParams.state;
      vm.orderStateName = Orders.getOrderState(vm.state).name;
      vm.orders = _.filter($rootScope.orders.orders, function(order){return Orders.isOfStates(order, vm.state)});
      vm.brands = $rootScope.orders.brands;
      vm.order_carts = $rootScope.orders.order_carts;
      vm.ship_type = $rootScope.orders.ship_type;
    }

    vm.undo = function(id){
      Orders.undo(id).then(function(result){
        activate();
      });
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
        var order = _.find($rootScope.orders.orders, function(order){return order.Order.id == orderId});
        order.Order.status = 3;
        vm.onGoodsReceived(order);
      });
    }
    function onGoodsReceived(order){
      $rootScope.alertMessage("已确认收货");
      vm.orders = _.filter($rootScope.orders.orders, function(order){return Orders.isOfStates(order, vm.state)});
      $rootScope.$broadcast('orderStateChanged', order);
    }
    function viewLogistics(id){
    }
    function addRemark(id){
    }
    function remindSendingGoods(order){
      order.reminded = true;
      $timeout(function(){
        $rootScope.alertMessage('已经提醒卖家发货');
      }, 500);
    }
  }
})(window, window.angular);