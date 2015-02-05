(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMainCtrl', MyMainCtrl)

  /* @ngInject */
  function MyMainCtrl($q,$state,$rootScope, $scope, $log, Users, Orders,Addresses,Carts){
    var vm = this;
    vm.profileClick = profileClick;
    vm.getPendingStates = getPendingStates;
    vm.toOrders = toOrders;
    vm.toCoupons = toCoupons;
    vm.toOffer = toOffer;
    vm.toAddresses = toAddresses;
    activate();

    function activate() {
      vm.loggedIn = $rootScope.user.loggedIn;
      vm.user = $rootScope.user.profile.User;
      vm.showLog = $rootScope.config.showLog;
      vm.pendingStates = vm.getPendingStates([]);
      $scope.$watch('user.loggedIn', function(newToken, oldToken) {
        vm.loggedIn = $rootScope.user.loggedIn;
      });
      $scope.$watch('user.orders', function(newOrders, oldOrders) {
        vm.pendingStates = vm.getPendingStates($rootScope.user.orders);
      });
      $scope.$watch('config.showLog', function() {
        vm.showLog = $rootScope.config.showLog;
      });
      $rootScope.$on("orderStateChanged", function(event, order){
        vm.pendingStates = vm.getPendingStates($rootScope.user.orders);
      });
    }

    function toOrders(p_state){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      $state.go('orders',{state: p_state});
    }

    function toCoupons(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      $state.go('app.my-coupons');
    }

    function toOffer(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      $state.go('app.my-offers');
    }

    function toAddresses(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      $state.go('addresses',{state:0,addrId:0});
    }

    function getPendingStates(orders){
      return _.map(Orders.getPendingOrderStates(), function(pendingOrderState){
        return {orders: _.filter(orders, function(order){return order.Order.status == pendingOrderState.state}), 
                orderState: pendingOrderState}
      });
    }
    function profileClick(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      $state.go("app.my-profile");
    }
  } 
})(window, window.angular);