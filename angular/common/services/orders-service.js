(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service('Orders', Orders)

  function Orders($log,$q,Base,config,Users){
    var self = this;
    self.ORDER_STATES = [
      {state:-1, value: 'ALL', name:'全部', pending: false},
      {state:0, value: 'UNPAID', name:'待支付', pending: true, status: '待支付'},
      {state:1, value: 'PAID', name:'待发货', pending: true, status: '待发货'},
      {state:2, value: 'SENT', name:'待收货', pending: true, status: '已发货'},
      {state:3, value: 'RECEIVED', name:'待评价', pending: true, status: '交易成功'},
      {state:4, value: 'REFUNDED', name:'已退款', pending: false, status: '交易关闭'},
      {state:9, value: 'SUCCESSED', name:'已完成', pending: false, status: '交易成功'},
      {state:10, value: 'CANCELED', name:'已取消', pending: false, status: '交易关闭'},
      {state:12, value: 'COMPLAINED', name:'已投诉', pending: false}
    ]
    return {
      list: list,
      isOfStates: isOfStates, 
      getOrderState: function(state){return _.find(self.ORDER_STATES, function(orderState){return orderState.state == state})},
      getPendingOrderStates: function(){return _.filter(self.ORDER_STATES, function(orderState){return orderState.pending})}, 
      submitOrder: submitOrder,
      cancelOrder: cancelOrder,
      remove: remove,
      confirmReceivingGoods: confirmReceivingGoods,
      getOrderDetail: getOrderDetail 
    }

    function list(accessToken){
      return Base.get('/api_orders/mine.json?access_token=' + accessToken);
    }
    function isOfStates(order, states){
      if(states == -1){
        return true;
      }
      var state = (order || {Order: {}}).Order.status;
      if(_.isArray(states)){
        return _.contains(states, state);
      }
      return state == states;
    }
    function submitOrder(pid_list,addressId,coupon_code,remarks, accessToken){
      var json = {"pid_list":pid_list,"addressId":addressId,"coupon_code":coupon_code,"remarks":remarks};
      var defer =  $q.defer();
      Base.post('/api_orders/balance.json?access_token=' + accessToken,json).then(function(result){
        if(result.data.success){
          defer.resolve(result.data.order_ids);
        }
        else{
          defer.reject(result);
        }
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function cancelOrder(id, accessToken){
      return Base.get('/api_orders/confirm_undo/'+id+'.json?access_token=' + accessToken);
    }
    function remove(id, accessToken){
      return Base.get('/api_orders/confirm_remove/'+id+'.json?access_token=' + accessToken);
    }
    function confirmReceivingGoods(id, accessToken){
      return Base.get('/api_orders/confirm_receive/'+id+'.json?access_token=' + accessToken);
    }
    function getOrderDetail(orderId, accessToken){
      return Base.get('/apiOrders/order_detail/' + orderId + '.json?access_token=' + accessToken);
    }
  }
})(window, window.angular);