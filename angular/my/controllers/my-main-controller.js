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
    activate();

    function activate() {
      vm.loggedIn = !_.isEmpty($rootScope.user.user);
      vm.pendingStates = vm.getPendingStates([]);
      $scope.$watch('user.user', function(newUser, oldUser) {
        $log.log('user changed!');
        vm.loggedIn = !_.isEmpty(newUser);
        if(vm.loggedIn){
          Users.getUser().then(function(user){
            vm.user = user.my_profile.User;
            vm.trying = user.my_profile.Shichituan;
          });
          Orders.list().then(function(data){
            $rootScope.orders = {orders: data.orders, brands: data.brands, order_carts: data.order_carts, ship_type: data.ship_type};
            vm.pendingStates = vm.getPendingStates($rootScope.orders.orders);
          });
          Carts.getCartItems().then(function(result){
            $rootScope.updateCart(result);
          });
          Addresses.list().then(function(addresses){
            $rootScope.addresses = addresses;
          });
        }
        else{
          $rootScope.orders = {orders: [], brands: [], order_carts:[], ship_type: {}};
          vm.pendingStates = vm.getPendingStates($rootScope.orders.orders);
          $rootScope.updateCart({cartItems:[], brands:[]});
          $rootScope.addresses = [];
        }
      });
      $rootScope.$on("orderStateChanged", function(event, order){
        vm.pendingStates = vm.getPendingStates($rootScope.orders.orders);
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