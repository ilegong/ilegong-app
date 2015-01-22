(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMainCtrl', MyMainCtrl)

  /* @ngInject */
  function MyMainCtrl($q,$state,$rootScope, $scope, $log, Users, Orders){
    var vm = this;
    vm.profileClick = profileClick;
    vm.getPendingStates = getPendingStates;
    vm.countOfOrders = function(state){return _.filter(vm.orders, function(order){return Orders.isOfStates(order, state)}).length};
    activate();

    function activate() {
      vm.loggedIn = !_.isEmpty($rootScope.user.user);
      vm.pendingStates = vm.getPendingStates([]);
      Users.getUser().then(function(user){
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
      });
      Orders.list().then(function(data){
        $rootScope.orders = data.orders;
        vm.pendingStates = vm.getPendingStates($rootScope.orders);
      });
      $scope.$watch('user.user', function(newUser, oldUser) {
        vm.loggedIn = !_.isEmpty(newUser);
      });
      $rootScope.$on("orderStateChanged", function(event, order){
        vm.pendingStates = vm.getPendingStates($rootScope.orders);
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