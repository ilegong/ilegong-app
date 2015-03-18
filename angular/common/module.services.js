(function (window, angular) {
  "use strict";

  angular
  .module('module.services', ['LocalForageModule'])
  .value('config', {fakeData: true, developmentMode: false, timeout: 2500, app: {client_id: 'NTQ5NTE5MGViMTgzMDUw', name: 'ailegong', hotline: '010-56245991', bizline: '159-1050-2109'}, server: {address: 'http://www.tongshijia.com'}})
  .service('Base', Base)
  /* @ngInject */
  function Base($http, $q, $log, $localForage, $window, $timeout, config, FakeData){
    var self = this;
    self.getUrl = getUrl;
    self.get = get;
    $window.device = $window.device || {};
    return {
      get: get,
      post: post,
      ping: ping, 
      getLocal: getLocal,
      setLocal: setLocal,
      removeLocal: removeLocal,
      deferred: deferred,
      getUrl: getUrl, 
      isBlank: isBlank,
      isMobileValid: isMobileValid,
      getDevice: function(){return $window.device}
    }

    function get(url){
      // var defer = $q.defer();
      // $timeout(function(){
      //   defer.reject('');
      // }, 3000);
      // return defer.promise;
      if(config.fakeData){
        $log.log(url).log(FakeData.get(url));
        return deferred(FakeData.get(url));
      }
      var defer = $q.defer();
      $http.get(self.getUrl(url))
        .success(function(data, status, headers, config) {
          if(status == 200){
            $log.log("get " + url + " succeeded: ").log(data);
            defer.resolve(data);
          }
          else{
            $log.log("get " + url + " failed with status " + status +": ").log(data);
            defer.reject({data: data, status: status});
          }
        })
        .error(function(data, status, headers, config) {
          $log.log("get " + url + " failed with status: " + status + ", data: ").log(data).log(", and config: ").log(config);
          defer.reject({data: data, status: status});
        });
      return defer.promise;
    }
    function post(url, data){
      if(config.fakeData){
        return deferred(FakeData.post(url));
      }

      var defer = $q.defer();
      $log.log("post to " + url + ": ").log(data);
      return $http.post(self.getUrl(url), data)        
        .success(function(data, status, headers, config) {
          if(status == 200){
            $log.log('succeeded, data: ').log(data);
            defer.resolve(data);
          }
          else{
            $log.log("failed with status: " + status +", data: ").log(data);
            defer.reject({data: data, status: status});
          }
        })
        .error(function(data, status, headers, config) {
          $log.log("failed with status :" + status + ", data: ").log(data).log(', and config').log(config);
          defer.reject({data: data, status: status});
        });
      return defer.promise;
    }
    function ping(){
      return self.get('/api_orders/ping');
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
      return config.server.address + url;
    }
    function deferred(data){
      var defer = $q.defer();
      defer.resolve(data);
      return defer.promise;
    }

    function isMobileValid(mobile){
      return /^1\d{10}$/.test(mobile);
    }
    
    function isBlank(str){
      return (!str || /^\s*$/.test(str));
    }

  }
})(window, window.angular);