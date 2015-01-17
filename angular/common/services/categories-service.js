(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Categories', Categories)

  function Categories(Base){
    var self = this;
    return {
      get: get
    }

    function get(slug){
      return Base.get("/categories/tag/" + slug + ".json");
    }
  }
})(window, window.angular);