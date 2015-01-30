(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Users', Users)

  /* @ngInject */
  function Users($rootScope,$log, $q, config, Base){
    var self = this;
    self.token = null;
    self.user = null;
    return {
      getToken: getToken,
      getUser: getUser,
      getCaptchaImageUrl: getCaptchaImageUrl, 
      verifyCaptchaCode: verifyCaptchaCode, 
      getSmsCode: getSmsCode, 
      register: register, 
      login: login, 
      aliPay: aliPay,
      getTokenLocally:getTokenLocally,
      refreshToken:refreshToken
    }

    function getToken(){
      var defer = $q.defer();
      Base.getLocal('token').then(function(token){
        if(!_.isEmpty(token)){
          defer.resolve(token);
        }
        else{
          defer.reject("no local token found");
        }
      }, function(e){defer.reject(e);});
      return defer.promise;
    }
    function getTokenLocally(){
      return $rootScope.user.token;
    }
    function getUser(){
      var defer = $q.defer();
      Base.getLocal('profile').then(function(user){
        if(!_.isEmpty(user)){
          defer.resolve(user);
        }
        else{
          defer.reject("no local user found");
        }
      }, function(e){defer.reject(e);});
      return defer.promise;
    }

    function login(username, password){
      return Base.get('/oauth/token?grant_type=password&username=' + username + '&password=' + password + '&client_id=' + config.app.client_id).then(function(token) {
        $rootScope.onUserLoggedIn(token, true);
        return $rootScope.user.token;
      });
    }
    function refreshToken(refreshToken){
      return Base.get('/oauth/token?grant_type=refresh_token&refresh_token='+refreshToken+'&client_id='+config.app.client_id).then(function(token){
        $rootScope.onUserLoggedIn(token, true);
        return $rootScope.user.token;
      })
    }
    function getCaptchaImageUrl(){
      return Base.getUrl("/check/captcha?type=app&device_uuid=" + Base.getDevice().uuid);
    }

    function verifyCaptchaCode(captchaCode){
      var defer = $q.defer();
      Base.get("/check/verify?type=app&device_uuid=" + Base.getDevice().uuid + "&keyString=" + captchaCode).then(function(data){
        if(data.success){
          defer.resolve(data);
        }
        else{
          defer.reject(data);
        }
      }, function(e){
        defer.reject(e);
      });
      return defer.promise;
    }

    function getSmsCode(mobile, captchaCode){
      var defer = $q.defer();
      Base.get("/check/message_code?type=app&mobile=" + mobile + "&device_uuid=" + Base.getDevice().uuid + "&keyString=" + captchaCode).then(function(data){
        if(data.success){
          defer.resolve(data);
        }
        else{
          defer.reject(data);
        }
      }, function(e){
        defer.reject(e);
      })
      return defer.promise;
    }

    function register(mobile, password, smsCode){
      var data = {
        client_id: config.app.client_id, 
        mobile: mobile, 
        password: password, 
        code: smsCode, 
        device_uuid: Base.getDevice().uuid
      }
      var nickname = "用户" + mobile.substring(7)
      return Base.get('/oauth/register?client_id=' + config.app.client_id + "&mobile=" + mobile + "&password=" + password + "&code=" + smsCode + "&device_uuid=" + Base.getDevice().uuid + "&nickname=" + nickname).then(function(token){
        $rootScope.onUserLoggedIn(token, true);
        return $rootScope.user.token;
      });
    }
    function aliPay(orderId){
      var defer = $q.defer();
      var userId = $rootScope.user.profile.User.id;
      var url = "http://www.tongshijia.com/ali_pay/wap_to_alipay/" + orderId + "?from=app&uid=" + userId;
      var ref = window.open(url, '_blank', 'location=no');
      defer.resolve(ref);
      return defer.promise;
    }
  }
})(window, window.angular);