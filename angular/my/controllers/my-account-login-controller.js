(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAccountLoginCtrl', MyAccountLoginCtrl)

  /* @ngInject */
  function MyAccountLoginCtrl($ionicHistory,$rootScope, $scope, $state, $log, $timeout, software, Users){
    var vm = this;
    vm.login = login;
    vm.readyToLogin = function(){return !_.isEmpty(vm.username) && !_.isEmpty(vm.password)};
    activate();

    function activate(){
      vm.username = "";
      vm.password = "";
      vm.loginFailed = false;
    }

    function login(){
      Users.login(vm.username, vm.password).then(function(token){
        $ionicHistory.goBack();
      }, function(e){
        vm.loginFailed = true;
        $timeout(function(){vm.loginFailed = false}, software.timeout);
      })
    }
  }
})(window, window.angular);