(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service("Tryings", Tryings)

  /* @ngInject */
  function Tryings($log, Base){
    var self = this;

    return {
      list: list, 
      getArticle: getArticle
    }

    function list(){
      return Base.get('/shichituan.json');
    }

    function getArticle(articleId){
      return Base.get("/api_orders/articles/" + articleId + ".json");
    }
  }
})(window, window.angular);