(function (window, angular) {
  "use strict";

  angular
  .module('module.services', ['LocalForageModule'])
  .value('config', {fakeData: true, showLog: false, timeout: 2500, app: {client_id: 'NTQ5NTE5MGViMTgzMDUw', name: 'ailegong', hotline: '(010)5624 5991', bizline: '189-1191-1240'}, server: {address: 'http://www.tongshijia.com'}})
  .service('Base', Base)
  /* @ngInject */
  function Base($http, $q, $log, $localForage, $window, config, FakeData){
    var self = this;
    self.getUrl = getUrl;
    $window.device = $window.device || {};
    return {
      get: get,
      post: post, 
      getLocal: getLocal, 
      setLocal: setLocal, 
      removeLocal: removeLocal,
      deferred: deferred, 
      getUrl: getUrl, 
      getDevice: function(){return $window.device}
    }

    function get(url){
      if(config.fakeData){
        $log.log(url).log(FakeData.get(url));
        return deferred(FakeData.get(url));
      }

      var defer = $q.defer();
      $http.get(self.getUrl(url))
        .success(function(data, status, headers, config) {
          if(status == 200){
            defer.resolve(data);
          }
          else{
            defer.reject({data: data, status: status});
          }
        })
        .error(function(data, status, headers, config) {
          $log.log("get " + url + " failed: " + status).log(data).log(config);
          defer.reject({data: data, status: status});
        });
      return defer.promise;
    }
    function post(url, data){
      if(config.fakeData){
        return deferred(FakeData.post(url));
      }

      $log.log("post"+url);
      var defer = $q.defer();
      return $http.post(self.getUrl(url), data)        
        .success(function(data, status, headers, config) {
          if(status == 200){
            defer.resolve(data);
          }
          else{
            defer.reject({data: data, status: status});
          }
        })
        .error(function(data, status, headers, config) {
          $log.log("post to " + url + " failed: " + status).log(data).log(config);
          defer.reject({data: data, status: status});
        });
      return defer.promise;
    }

    function getLocal(key){
      if(config.fakeData){
        return deferred(FakeData.getLocal(key));
      }
      return $localForage.getItem(key);
    }

    function setLocal(key, value){
      if(config.fakeData){
        return deferred(value);
      }
      return $localForage.setItem(key, value);
    }
    function removeLocal(key){
      if(config.fakeData){
        return deferred(key);
      }
      return $localForage.removeItem(key);
    }
    function getUrl(url){
      $log.log('get ' + config.server.address + url);
      return config.server.address + url;
    }
    function deferred(data){
      var defer = $q.defer();
      defer.resolve(data);
      return defer.promise;
    }
    function getLocalSync(key){
      if(config.fakeData){
        return FakeData.getLocal(key);
      }
      else{
        return $localForage.getItem(key);
      }
    }
  }
})(window, window.angular);