(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log,$scope,$rootScope,$http,Orders){
    var vm = this;
    vm.getOrderDesc = function(order){return Orders.getOrderStatus(order).desc};
    vm.isOfStates = vm.isOfState = function(order, states){return Orders.isOfStates(order, states)};
    activate();
    
    vm.stateFilter = '';
    function activate() {
      Orders.list().then(function(data){
        vm.orders = data.orders;
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
    vm.receive = function(id){
      Orders.receive(id).then(function(result){
        activate();
      });
    }
  }
})(window, window.angular);