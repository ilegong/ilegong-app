(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Carts', Carts)
  
  function Carts($rootScope,$q,$log,Base,config,Users){
    var self = this;
    return{
      getCartItems:getCartItems,
      deleteCartItem: deleteCartItem,
      addCartItem: addCartItem,
      editNum:editNum, 
      getCartInfo: getCartInfo
    }
    function getCartInfo(pid_list, coupon_code, accessToken){
      var json = {"pid_list":pid_list, "coupon_code":coupon_code};
      var defer = $q.defer();
      Base.post('/api_orders/cart_info.json?access_token=' + accessToken, json).then(function(result) {
        if(result.data.success){
          defer.resolve(result.data);  
        }
        else{
          defer.reject(result.data);
        }
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getCartItems(accessToken){
      var defer = $q.defer();
      Base.get('/ApiOrders/list_cart.json?access_token=' + accessToken).then(function(list){
        $log.log('get cart items:').log(list);
        defer.resolve(list);
      }, function(e){defer.reject(e)})
      return defer.promise;
    }
    function deleteCartItem(id, accessToken){
      var defer = $q.defer();
      Base.get('/ApiOrders/cart_del/'+id+'.json?access_token=' + accessToken).then(function(result){
        $log.log("delete cart item successfully: ").log(result)
        defer.resolve(result);
      },function(error){defer.reject(error)});
      return defer.promise;
    }
    function addCartItem(id,num,spec,type,try_id, accessToken){
      var defer = $q.defer();
      var json = {"product_id":id,"num":num,"spec":spec,"type":type,"try_id":try_id};

      Base.post('/api_orders/cart_add.json?access_token=' + accessToken,json).then(function(result){
        if(result.data.success){
          defer.resolve(result.data);
        }
        else{
          defer.reject(result);
        }
      },function(e){defer.reject(e);});
      return defer.promise;
    }
    function editNum(id,num, accessToken){
      var defer = $q.defer();
      Base.get('/api_orders/cart_edit_num/'+id+'/'+num+'.json?access_token=' + accessToken).then(function(result){
        if(result.success == true){
          defer.resolve(result);
        }
        else{
          defer.reject(result);
        }
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }
})(window, window.angular);