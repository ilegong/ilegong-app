(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('OfflineStores', OfflineStores)

  function OfflineStores($log,$q,Base,config,Users){
    var self = this;
    return{
      getOfflineStores:getOfflineStores,
      getBeijingArea:getBeijingArea
    };
    function getBeijingArea(){
      return {
        110101:"东城区",
        110108:"海淀区",
        110102:"西城区",
        110105:"朝阳区",
        110106:"丰台区",
        110114:"昌平区",
        110113:"顺义区",
        110115:"大兴区",
        110112:"通州区"
      };
    }
    function getOfflineStores(){
      var defer = $q.defer();
      Base.get('/tuan_buyings/get_offline_address?type=-1').then(function(result){
        defer.resolve(result);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }
})(window, window.angular);