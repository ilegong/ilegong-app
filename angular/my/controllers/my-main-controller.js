(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMainCtrl', MyMainCtrl)

  /* @ngInject */
  function MyMainCtrl($q,$state,$rootScope, $scope, $log, Users){
    var vm = this;
    vm.profileClick = profileClick;
    vm.toMyOrdersPage = function(state){$state.go("app.my-orders", {orderState: state})};
    activate();
    function activate() {
      vm.loggedIn = !_.isEmpty($rootScope.user.user);
      Users.getUser().then(function(user){
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
      });
      $scope.$watch('user.user', function(newUser, oldUser) {
        vm.loggedIn = !_.isEmpty(newUser);
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