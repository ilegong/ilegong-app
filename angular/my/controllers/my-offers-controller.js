(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOffersCtrl',MyOffersCtrl)

  function MyOffersCtrl($scope,$rootScope,$http,Offers) {
    var vm = this;
    vm.isOfferValid = function(offer){return Offers.isOfStates(offer, ['NEW', 'GOING'])};
    vm.getOfferDesc = function(offer){return Offers.getOfferStatus(offer).desc};
    activate();
    function activate() {
      Offers.list().then(function(data){
        vm.sharedOffers = data.sharedOffers;
        vm.expiredIds = data.expiredIds;
        vm.soldOuts = data.soldOuts;
        vm.brands = _.map(data.brands, function(brand){return brand});
      });
    }
  }  
})(window, window.angular);