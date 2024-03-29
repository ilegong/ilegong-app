(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Products', Products)

  /* @ngInject */
  function Products($q,$log, Base,config,Users){
    var self = this;
    return {
      getProduct:getProduct,
      getProductContent:getProductContent,
      getProductComment:getProductComment,
      makeComment:makeComment
    }

    function getProduct(id, type, extraId){
      var defer = $q.defer();
      Base.get('/api_orders/product_detail/'+id + '/' + type + '/' + extraId + '.json').then(function(product){
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
    function makeComment(id,rating,body,pictures, accessToken){

      var defer = $q.defer();
      var json = {'data_id':""+id,'type':'Product','rating':""+rating,'body':body,'pictures':pictures};
      $log.log('posting comment!!!');
      Base.post('/api_orders/comment_add.json?access_token=' + accessToken,json).then(function(result){
        $log.log('success!!!');
        $log.log(result);
        defer.resolve(result);
        //$log.log(result);
      },function(err){defer.reject(err);$log.log('error!!!');});
      return defer.promise;
    }
  }
})(window, window.angular);