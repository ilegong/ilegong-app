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
      confirmCart: confirmCart
    }
    function confirmCart(pid_list, coupon_code, accessToken){
      var json = {"pid_list":pid_list, "coupon_code":coupon_code};
      var defer = $q.defer();
      Base.post('/api_orders/cart_info.json?access_token=' + accessToken, json).then(function(result) {
        if(result.data.success){
          defer.resolve(result.data);  
        }
        else{
          defer.reject(result);
        }
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getCartItems(accessToken){
      return Base.get('/ApiOrders/list_cart.json?access_token=' + accessToken);
    }
    function deleteCartItem(id, accessToken){
      return Base.get('/ApiOrders/cart_del/'+id+'.json?access_token=' + accessToken);
    }
    function addCartItem(type, json, accessToken){
      var defer = $q.defer();
      var url = type == 5 ? '/api_tuan/cart_add.json' : '/api_orders/cart_add.json'
      Base.post(url + '?access_token=' + accessToken, json).then(function(result){
        if(result.data.success){
          defer.resolve(result);
        }
        else{
          defer.reject(result);
        }
      }, function(e){defer.reject(e);});
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