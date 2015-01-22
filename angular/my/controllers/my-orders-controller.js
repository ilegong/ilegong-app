(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log, $scope, $rootScope, $http, $stateParams, $timeout, Orders){
    var vm = this;
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.onGoodsReceived = onGoodsReceived;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    activate();
    
    function activate() {
      vm.state =$stateParams.state;
      vm.orderState = Orders.getOrderState(vm.state);
      vm.orders = [];
      Orders.list().then(function(data){
        $rootScope.orders = data.orders;
        vm.orders = _.filter($rootScope.orders, function(order){return Orders.isOfStates(order, vm.state)});
        vm.brands = data.brands;
        vm.order_carts = data.order_carts;
        vm.ship_type = data.ship_type;
      });
    }

    vm.undo = function(id){
      Orders.undo(id).then(function(result){
        activate();
      });
    }
    vm.remove = function(id){
      Orders.remove(id).then(function(result){
        activate();
        $log.log(result);
      });
    }
    function confirmReceivingGoods(order){
      if(order.Order.status != 2){
        $log.log("cannot confirm receiving goods as current state is " + order.Order.status);
        return;
      }
      var orderId = order.Order.id;
      Orders.confirmReceivingGoods(orderId).then(function(result){
        var order = _.find($rootScope.orders, function(order){return order.Order.id == orderId});
        order.Order.status = 3;
        vm.onGoodsReceived(order);
      });
    }
    function onGoodsReceived(order){
      $rootScope.alertMessage("已确认收货");
      vm.orders = _.filter($rootScope.orders, function(order){return Orders.isOfStates(order, vm.state)});
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