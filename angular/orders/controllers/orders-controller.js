(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('OrdersCtrl', OrdersCtrl)

  function OrdersCtrl($log, $scope, $rootScope, $http, $stateParams, $timeout, Orders){
    var vm = this;
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    vm.addRemark = addRemark;
    vm.doRefresh = doRefresh;
    vm.filterOrders = filterOrders;
    vm.getOrderHeight = getOrderHeight;
    vm.showOrderOperations = showOrderOperations;
    vm.removeOrder = removeOrder;
    activate();
    
    function activate() {
      vm.state =$stateParams.state;
      vm.orderStateName = Orders.getOrderState(vm.state).name;
      vm.orders = vm.filterOrders($rootScope.user.orders, $rootScope.brands, vm.state);
      vm.ship_type = $rootScope.user.ship_type;
      $rootScope.$on("orderStateChanged", function(event, order){
        vm.orders = vm.filterOrders($rootScope.user.orders, $rootScope.brands, vm.state);
      });
    }
    function doRefresh(){
      $rootScope.reloadOrders($rootScope.user.token.access_token).then(function(){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      }, function(){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
      });
    }
    function filterOrders(orders, brands, state){
      var orderOfStates = _.filter($rootScope.user.orders, function(order){return Orders.isOfStates(order, state)});
      return _.map(orderOfStates, function(order){
        order.Order.brand = _.find(brands, function(brand){return brand.Brand.id == order.Order.brand_id});
        order.Order.products =$rootScope.user.order_carts[order.Order.id];
        order.Order.orderState = Orders.getOrderState(order.Order.status);
        return order;
      });
    }
    function getOrderHeight(order){
      var marginOffset = 1;
      var productsHeight = 0;
      if(!_.isEmpty(order.Order) && !_.isEmpty(order.Order.products)){
        productsHeight = order.Order.products.length * (90 - marginOffset);
      }
      var brandHeight = 50;
      var postFeeHeight = 42;
      var operationsHeight = 0;
      if(vm.showOrderOperations(order)){
        operationsHeight = 50;
      }
      return ((brandHeight + postFeeHeight + operationsHeight + productsHeight) + 10 - 3 * marginOffset) + "px";
    }
    function showOrderOperations(order){
      return [0, 1, 2, 4, 10].indexOf(parseInt(order.Order.status)) >= 0;
    }
    function confirmReceivingGoods(order){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      if(order.Order.status != 2){
        $log.log("cannot confirm receiving goods for order " +  order.Order.id + " with state " + order.Order.status);
        return;
      }
      var orderId = order.Order.id;
      Orders.confirmReceivingGoods(orderId, $rootScope.user.token.access_token).then(function(result){
        $rootScope.updateOrderState(orderId, 3);
        $rootScope.alertMessage("已确认收货");
      }, function(e){
        $log.log("failed to confirm receiving goods:").log(e);
        $rootScope.alertMessage("确认收货失败，请重试");
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
    function removeOrder(order){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      if(order.Order.status != 4 && order.Order.status != 10){
        $log.log("cannot remove order " +  order.Order.id + " with state " + order.Order.status);
        return;
      }

      var orderId = order.Order.id;
      Orders.removeOrder(orderId, $rootScope.user.token.access_token).then(function(){
        $rootScope.reloadOrders($rootScope.user.token.access_token).then(function(){
          $rootScope.alertMessage("已删除订单");  
        }, function(e){
          $rootScope.removeOrder(orderId);
        });
      }, function(e){
        $log.log("failed to remove order " + orderId + ": ").log(e);
        $rootScope.alertMessage("删除订单失败，请重试");
      });
    }
  }
})(window, window.angular);