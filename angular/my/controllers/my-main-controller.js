(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMainCtrl', MyMainCtrl)

  /* @ngInject */
  function MyMainCtrl($q,$state,$rootScope, $scope, $log, Users, Orders){
    var vm = this;
    vm.profileClick = profileClick;
    vm.getOrdersCountOf = getOrdersCountOf;
    activate();

    function activate() {
      vm.loggedIn = !_.isEmpty($rootScope.user.user);
      vm.unFinishedOrderStates = Orders.getUnFinishedOrderStates();
      vm.orders = [];
      Users.getUser().then(function(user){
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
      });
      Orders.list().then(function(data){
        vm.orders = data.orders;
      });
      $scope.$watch('user.user', function(newUser, oldUser) {
        vm.loggedIn = !_.isEmpty(newUser);
      });
    }

    function getOrdersCountOf(orderStates){
      if(_.isEmpty(orderStates)){
        return vm.orders.length;
      }
      return _.filter(vm.orders, function(order){return Orders.isOfStates(order, orderStates)}).length;
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