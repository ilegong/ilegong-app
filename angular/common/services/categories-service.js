(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Categories', Categories)

  function Categories(Base){
    var self = this;
    return {
      get: get, 
      getProducts: getProducts,
      getSeckills: getSeckills
    }

    function get(slug){
      return Base.get("/categories/tag/" + slug + ".json");
    }
    function getProducts(tagId){
      return Base.get("/categories/api_tag_products/" + tagId);
    }
    function getSeckills(){
      return Base.get("/categories/api_seckills");
    }
  }
})(window, window.angular);