(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMainCtrl', MyMainCtrl)

  /* @ngInject */
  function MyMainCtrl($q,$state,$rootScope, $scope, $log, Users, Orders,Addresses,Carts){
    var vm = this;
    vm.profileClick = profileClick;
    vm.getPendingStates = getPendingStates;
    vm.countOfOrders = function(state){return _.filter(vm.orders, function(order){return Orders.isOfStates(order, state)}).length};
    vm.toOrders = toOrders;
    vm.toCoupons = toCoupons;
    vm.toOffer = toOffer;
    vm.toAddresses = toAddresses;
    activate();

    function activate() {
      vm.loggedIn = !_.isEmpty($rootScope.user.token);
      vm.user = $rootScope.user.profile.User;
      vm.pendingStates = vm.getPendingStates([]);
      $scope.$watch('user.token', function(newToken, oldToken) {
        vm.loggedIn = !_.isEmpty($rootScope.user.token);
      });
      $scope.$watch('orders.orders', function(newOrders, oldOrders) {
        vm.pendingStates = vm.getPendingStates(newOrders);
      });
      $rootScope.$on("orderStateChanged", function(event, order){
        vm.pendingStates = vm.getPendingStates($rootScope.orders.orders);
      });
    }

    function toOrders(p_state){
      $rootScope.ensureLogin().then(function(){
        $state.go('app.my-orders',{state: p_state});
      }, function(toLogin){
        $state.go('app.my-account-login');
      });
    }

    function toCoupons(){
      $rootScope.ensureLogin().then(function(){
        $state.go('app.my-coupons');
      }, function(toLogin){
        $state.go('app.my-account-login');
      });      
    }

    function toOffer(){
      $rootScope.ensureLogin().then(function(){
        $state.go('app.my-offers');
      }, function(toLogin){
        $state.go('app.my-account-login');
      });  
    }

    function toAddresses(){
      $rootScope.ensureLogin().then(function(){
        $state.go('app.my-addresses',{state:0,addrId:0});
      }, function(toLogin){
        $state.go('app.my-account-login');
      });        
    }

    function getPendingStates(orders){
      return _.map(Orders.getPendingOrderStates(), function(pendingOrderState){
        return {orders: _.filter(orders, function(order){return order.Order.status == pendingOrderState.state}), 
                orderState: pendingOrderState}
      });
    }
    function profileClick(){
      $rootScope.myMain.defer = $q.defer();
      $rootScope.myMain.defer.promise.then(function(result){
        activate();
      })
      if(vm.loggedIn){
        $state.go("app.my-profile");
      }
      else{
        $state.go("app.my-account-login");
      }
    }
  } 
})(window, window.angular);