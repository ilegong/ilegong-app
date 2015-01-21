(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  function MyOrdersCtrl($log, $scope, $rootScope, $http, $stateParams, Orders){
    var vm = this;
    vm.getOrderDesc = function(order){return Orders.getOrderStatus(order).desc};
    vm.isOfStates = vm.isOfState = function(order, states){return Orders.isOfStates(order, states)};
    vm.getOrdersOfStates = function(states){return _.filter(vm.orders, function(order){return vm.isOfStates(order, states)})};
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.viewLogistics = viewLogistics;
    vm.remindSendingGoods = remindSendingGoods;
    activate();
    
    function activate() {
      vm.states = _.contains($stateParams.states, ",") ? $stateParams.states.split(",") : $stateParams.states;
      vm.name = $stateParams.name;
      vm.orders = [];
      Orders.list().then(function(data){
        vm.orders = _.filter(data.orders, function(order){return Orders.isOfStates(order, vm.states)});
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
    function confirmReceivingGoods(id){
      Orders.receive(id).then(function(result){
        activate();
      });
    }
    function viewLogistics(id){
    }
    function addRemark(id){
    }
    function remindSendingGoods(){
    }
  }
})(window, window.angular);