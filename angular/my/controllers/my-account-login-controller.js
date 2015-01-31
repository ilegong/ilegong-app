(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAccountLoginCtrl', MyAccountLoginCtrl)

  /* @ngInject */
  function MyAccountLoginCtrl($ionicHistory,$rootScope, $scope, $state, $log, $timeout, config, Users){
    var vm = this;
    vm.login = login;
    vm.resetPassword = resetPassword;
    vm.readyToLogin = function(){return !_.isEmpty(vm.username) && !_.isEmpty(vm.password)};

    activate();

    function activate(){
      vm.username = "";
      vm.password = "";
    }
    
    function login(){
      Users.login(vm.username, vm.password).then(function(){
        $ionicHistory.goBack();
      }, function(error){
        $log.log('login failed: ').log(error);
        $rootScope.alertMessage("账户或密码错误，请重试");
      })
    }
    function resetPassword(){
      vm.password = "";
    }
  }
})(window, window.angular);