(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Orders', Orders)

  function Orders($log,$q,Base,software,Users){
    var self = this;
    self.ORDER_STATUS = [
      {value: 'UNPAID', state:0, desc:'未支付'},
      {value: 'PAID', state:1, desc:'已支付'},
      {value: 'SENT', state:2, desc:'已发货'},
      {value: 'RECEIVED', state:3, desc:'已收货'},
      {value: 'REFUNDED', state:4, desc:'已退款'},
      {value: 'SUCCESSED', state:9, desc:'已完成'},
      {value: 'CANCELED', state:10, desc:'已取消'},
      {value: 'VERIFIED', state:11, desc:'已确认有效'},
      {value: 'COMPLAINED', state:12, desc:'已投诉'}
    ]
    return {
      list: list,
      getOrderStatus: getOrderStatus, 
      isOfStates: isOfStates, 
      submitOrder: submitOrder,
      undo:undo,
      remove: remove,
      receive: receive,
      getOrderDetail: getOrderDetail
    }

    function list(){
      var defer = $q.defer();   
      Base.get('/api_orders/mine.json?access_token='+Users.getTokenLocally().access_token).then(function(item){
        defer.resolve(item);
      });
      return defer.promise;
    }
    function getOrderStatus(order){
      order = order || {Order: {}}
      return _.find(self.ORDER_STATUS, function(orderStatus){return orderStatus.state == order.Order.status}) || {};
    }
    function isOfStates(order, states){
      var value = getOrderStatus(order).value;
      if(_.isArray(states)){
        return _.contains(states, value);
      }
      return value == states;
    }
    function submitOrder(pid_list,addressId,coupon_code,remarks){
      var json = {"pid_list":pid_list,"addressId":addressId,"coupon_code":coupon_code,"remarks":remarks};
      var defer =  $q.defer();
      Base.post('/api_orders/balance.json?access_token='+Users.getTokenLocally().access_token,json).then(function(result){
        if(result.data.success){
          defer.resolve(result.data.order_ids[0]);
        }
        else{
          defer.reject(result);
        }
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function undo(id){
      var defer = $q.defer();
      Base.get('/api_orders/confirm_undo/'+id+'.json?access_token='+Users.getTokenLocally().access_token).then(function(result){
        defer.resolve(result);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function remove(id){
      var defer = $q.defer()      
      Base.get('/api_orders/confirm_remove/'+id+'.json?access_token='+Users.getTokenLocally().access_token).then(function(result){
        defer.resolve(result);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function receive(id){
      var defer = $q.defer();
      Base.get('/api_orders/confirm_receive/'+id+'.json?access_token='+Users.getTokenLocally().access_token).then(function(result){
        defer.resolve(result);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getOrderDetail(orderId){
      var defer = $q.defer();
      Base.get('/apiOrders/order_detail/' + orderId + '.json?access_token='+Users.getTokenLocally().access_token).then(function(item){
        defer.resolve(item);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }
})(window, window.angular);