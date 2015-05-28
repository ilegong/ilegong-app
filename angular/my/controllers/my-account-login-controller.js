(function ($window, angular, cordova) {
  "use strict";

  angular.module('module.my')
  .controller('MyAccountLoginCtrl', MyAccountLoginCtrl)

  /* @ngInject */
  function MyAccountLoginCtrl($ionicHistory,$rootScope, $scope, $state, $log, $timeout, $q, Base, config, Users, Wechats){
    var vm = this;
    vm.login = login;
    vm.wechatLogin = wechatLogin;
    vm.tryToLoginByWechat = tryToLoginByWechat;
    vm.onWechatLoginFailed = onWechatLoginFailed;
    vm.share = share;
    vm.resetPassword = resetPassword;
    vm.readyToLogin = function(){return !_.isEmpty(vm.username) && !_.isEmpty(vm.password)};

    activate();

    function activate(){
      vm.username = "";
      vm.password = "";
      vm.showWXLoginBtn = false;
      if(window.Wechat){
        window.Wechat.isInstalled(function (installed) {
            vm.showWXLoginBtn = installed;
            $log.log('weixin installed: ' + installed);
        }, function (reason) {
            $log.log("Failed to call Wechat.isIntalled: " + reason);
        });
      }
    }
    
    function login(){
      Users.login(vm.username, vm.password).then(function(){
        $ionicHistory.goBack();
      }, function(error){
        $log.log('login failed: ').log(error);
        $rootScope.alertMessage("账户或密码错误，请重试");
      })
    }

    function tryToLoginByWechat(){
      var defer = $q.defer();
      var wechatToken = $rootScope.user.wechatToken;
      if(!_.isEmpty(wechatToken)){
        var isExpired = wechatToken.expires_at <= (((new Date()).valueOf())/1000);
        if(isExpired){
          Wechats.refreshAccessToken(wechatToken.refresh_token).then(function(wechatToken){
            vm.wechatLogin(wechatToken);
          }, function(error){
            vm.onWechatLoginFailed('ERR_REFRESH_ACCESS_TOKEN');
          });
        } else{
          vm.loginByWechat(wechatToken);
        }
      } else{
        Wechats.auth().then(function(authResult){
          Wechats.getAccessToken(authResult.code).then(function(wechatToken){
            vm.wechatLogin(wechatToken);
          }, function(){
            vm.onWechatLoginFailed('ERR_GET_ACCESS_TOKEN');
          });
        }, function(error){
          vm.onWechatLoginFailed(error);
        });
      }
    }
    function wechatLogin(wechatToken){
      Users.wechatLogin(wechatToken).then(function(token){
        $ionicHistory.goBack();
      }, function(error){
        vm.onWechatLoginFailed('ERR_LOGIN');
      });
    }
    function onWechatLoginFailed(error){
      if(error == 'ERR_AUTH_DENIED'){
        $rootScope.alertMessage("微信快捷登录: 用户没有授权");
      }
      else if(error == 'ERR_USER_CANCEL'){
        $rootScope.alertMessage("微信快捷登录: 用户取消了授权");
      }
      else if(error == 'ERR_GET_ACCESS_TOKEN'){
        $rootScope.alertMessage("微信快捷登录: 获取令牌失败");
      }
      else if(error == 'ERR_REFRESH_ACCESS_TOKEN'){
        $rootScope.alertMessage("微信快捷登录: 刷新令牌失败");
      }
      else{
        $rootScope.alertMessage("微信快捷登录失败，请重试");
      }
    }
    function share(){
      Wechats.share();
    }
    function resetPassword(){
      vm.password = "";
    }
  }
})(window, window.angular, window.cordova);