(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Wechats', Wechats)

  /* @ngInject */
  function Wechats($rootScope,$log, $q, config, Base){
    var self = this;
    return {
      auth: auth,
      getAccessToken: getAccessToken,
      refreshAccessToken: refreshAccessToken
    }

    function auth(){
      var defer = $q.defer();
      window.Wechat.auth("snsapi_userinfo", function (authResult) {
        $log.log('wechat auth succeeded: ').log(authResult);
        defer.resolve(authResult);
      }, function (error) {
        $log.log('wechat auth failed: ').log(error);
        defer.reject(error);
      });
      return defer.promise;
    }
    function getAccessToken(code){
      var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + config.app.appId + "&secret=" + config.app.appSecret + "&code=" + code + "&grant_type=authorization_code";
      return Base.get(url).then(function(token){
        $log.log('wechat get access token succeeded: ').log(token); 
        $rootScope.onWechatTokenRefreshed(token, true);
        return token;
      }, function(error){
        $log.log('wechat get access token failed: ').log(error); 
        return error;
      });
    }
    function refreshAccessToken(refreshToken){
      var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + config.app.appId + "&grant_type=refresh_token&refresh_token=" + refreshToken;
      return Base.get(url).then(function(wechatToken){
        $log.log('wechat refresh token succeeded: ').log(wechatToken);
        $rootScope.onWechatTokenRefreshed(wechatToken, true);
        return wechatToken;
      }, function(error){
        $log.log('wechat refresh token failed: ').log(error);
        return error;
      });
    }
    function getUserInfo(accessToken, openId){
      var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + accessToken + "&openid=" + openId;
      return Base.get(url).then(function(userInfo){
        $log.log('wechat get userinfo succeeded: ').log(userInfo);
      }, function(error){
        $log.log('wechat get userinfo failed: ').log(error);
      });
    }
  }
})(window, window.angular);