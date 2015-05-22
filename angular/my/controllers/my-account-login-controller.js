(function ($window, angular, cordova) {
  "use strict";

  angular.module('module.my')
  .controller('MyAccountLoginCtrl', MyAccountLoginCtrl)

  /* @ngInject */
  function MyAccountLoginCtrl($ionicHistory,$rootScope, $scope, $state, $log, $timeout, config, Users){
    var vm = this;
    vm.login = login;
    vm.weixinLogin = weixinLogin;
    vm.resetPassword = resetPassword;
    vm.readyToLogin = function(){return !_.isEmpty(vm.username) && !_.isEmpty(vm.password)};

    activate();

    function activate(){
      vm.username = "";
      vm.password = "";
      vm.isWeixinInstalled = false;
      cordova.Wechat.isInstalled(function (installed) {
          vm.isWeixinInstalled = installed;
          $log.log('weixin installed: ' + installed);
      }, function (reason) {
          $log.log("Failed to call Wechat.isIntalled: " + reason);
      });
    }
    
    function login(){
      Users.login(vm.username, vm.password).then(function(){
        $ionicHistory.goBack();
      }, function(error){
        $log.log('login failed: ').log(error);
        $rootScope.alertMessage("账户或密码错误，请重试");
      })
    }
    function weixinLogin(){
      var scope = "snsapi_userinfo";
      cordova.Wechat.auth(scope, function (response) {
        $log.log("weixin auth: ").log(JSON.stringify(response));
      }, function (reason) {
        $log.log("Failed to call weixin auth: " + reason);
      });
    }
    function resetPassword(){
      vm.password = "";
    }
  }
})(window, window.angular, window.cordova);