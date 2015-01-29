(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Users', Users)

  /* @ngInject */
  function Users($rootScope,$log, $q, config, Base){
    var self = this;
    self.token = null;
    self.user = null;
    self.onGetTokenSuccessfully = onGetTokenSuccessfully;
    return {
      init: init,
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

    function init(){
      var defer = $q.defer();
      Base.getLocal('token').then(function(token){
        if(!_.isEmpty(token)){
          $rootScope.user.token = token;
          if($rootScope.user.token.expires_at >= (((new Date()).valueOf())/1000)){
            Base.getLocal('profile').then(function(profile){
              $rootScope.user.profile = profile;
            });
            $rootScope.onUserInited(token);
            defer.resolve(token);
          }
          else{
            refreshToken(token.refresh_token, defer);
          }
        }
        else{
          defer.reject('token not found locally');
        }
      }, function(e){defer.reject(e)});
      return defer.promise;
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
      var defer = $q.defer();
      Base.get('/oauth/token?grant_type=password&username=' + username + '&password=' + password + '&client_id=' + config.app.client_id).then(function(token) {
          self.onGetTokenSuccessfully(token, defer);
        }, function(e){defer.reject(e)});
      return defer.promise; 
    }
    function refreshToken(refreshToken, defer){
      Base.get('/oauth/token?grant_type=refresh_token&refresh_token='+refreshToken+'&client_id='+config.app.client_id).then(function(token){
        self.onGetTokenSuccessfully(token, defer);
      },function(error){defer.reject(error)})
    }
    function onGetTokenSuccessfully(token, defer){
      $rootScope.user.token.expires_at = token.expires_in + ((new Date()).valueOf())/1000;
      Base.setLocal('token', $rootScope.user.token);
      $rootScope.onUserLoggedIn(token);
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
      var defer = $q.defer();
      var data = {
        client_id: config.app.client_id, 
        mobile: mobile, 
        password: password, 
        code: smsCode, 
        device_uuid: Base.getDevice().uuid
      }
      var nickname = "用户" + mobile.substring(7)
      Base.get('/oauth/register?client_id=' + config.app.client_id + "&mobile=" + mobile + "&password=" + password + "&code=" + smsCode + "&device_uuid=" + Base.getDevice().uuid + "&nickname=" + nickname).then(function(token){
        self.onGetTokenSuccessfully(token, defer);
      }, function(e){defer.reject(e)});
      return defer.promise;
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