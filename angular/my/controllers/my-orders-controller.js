(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log, $scope, $rootScope, $http, $stateParams, $timeout, Orders){
    var vm = this;
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    vm.addRemark = addRemark;
    vm.doRefresh = doRefresh;
    vm.filterOrders = filterOrders;
    vm.getOrderHeight = getOrderHeight;
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
      $rootScope.reloadOrders($rootScope.user.token.access_token);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
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
      if(order.Order.status <= 3){
        operationsHeight = 50;
      }
      return ((brandHeight + postFeeHeight + operationsHeight + productsHeight) + 10 - 3 * marginOffset) + "px";
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