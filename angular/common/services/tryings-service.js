(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service("Tryings", Tryings)

  /* @ngInject */
  function Tryings($log, Base){
    var self = this;

    return {
      list: list
    }

    function list(){
      return Base.get('/shichituan.json');
    }
  }
})(window, window.angular);