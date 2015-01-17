(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service("Offers", Offers)

  function Offers($q,$log,Base,software,Users){
    var self = this;
    self.OFFER_STATUS = [
      {value: 'NEW', state:0, desc:'新的'},
      {value: 'GOING', state:3, desc:'可以使用'},
      {value: 'EXPIRED', state:1, desc:'已过期'},
      {value: 'INVALID', state:2, desc:'已失效'}
    ]
    return{
      list:list, 
      getOfferStatus: getOfferStatus, 
      isOfStates: isOfStates
    }
    function list(){
      var defer = $q.defer();
      Base.get('/api_orders/my_offers.json?access_token=' + Users.getTokenLocally().access_token).then(function(item){
        defer.resolve(item);    
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getOfferStatus(offer){
      offer = offer || {SharedOffer: {}};
      return _.find(self.OFFER_STATUS, function(offerStatus){return offerStatus.state == offer.SharedOffer.status}) || {};
    }
    function isOfStates(offer, states){
      var offerStatus = getOfferStatus(offer);
    }
  }
})(window, window.angular);