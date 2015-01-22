(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log, $scope, $rootScope, $http, $stateParams, $timeout, Orders){
    var vm = this;
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    activate();
    
    function activate() {
      vm.state =$stateParams.state;
      vm.orderState = Orders.getOrderState(vm.state);
      vm.orders = [];
      Orders.list().then(function(data){
        vm.orders = _.filter(data.orders, function(order){return Orders.isOfStates(order, vm.state)});
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
      Orders.receive(id).then(function(result){
        activate();
      });
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