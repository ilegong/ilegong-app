(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Products', Products)

  /* @ngInject */
  function Products($q,$log, Base,software,Users){
    var self = this;
    return {
      list: list,
      getProduct:getProduct,
      getProductContent:getProductContent,
      getProductComment:getProductComment,
      makeComment:makeComment
    }

    function list(){
      return Base.get('/categories/mobileHome.json');
    }
    function getProduct(id){
      var defer = $q.defer();
      Base.get('/api_orders/product_detail/'+id+'.json?access_token='+Users.getTokenLocally().access_token).then(function(product){
        defer.resolve(product);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getProductContent(id){
      return Base.get('/apiOrders/product_content/'+id+'.json')
    }
    function getProductComment(id){
      return Base.get('/comments/getlist/Product/'+id+'.json')
    }
    function makeComment(id,rating,body,pictures){

      var defer = $q.defer();
      var json = {'data_id':""+id,'type':'Product','rating':""+rating,'body':body,'pictures':pictures};
      $log.log('posting comment!!!');
      Base.post('/api_orders/comment_add.json?access_token='+Users.getTokenLocally().access_token,json).then(function(result){
        $log.log('success!!!');
        defer.resolve(result);
        //$log.log(result);
      },function(err){defer.reject(err);$log.log('error!!!');});
      return defer.promise;
    }
  }
})(window, window.angular);