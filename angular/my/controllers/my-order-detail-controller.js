(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrderDetailCtrl',MyOrderDetailCtrl)

  function MyOrderDetailCtrl($scope, $rootScope, $http, $stateParams, $log, $state, $ionicHistory, Orders, Users) {
    var vm = this;
    vm.isOfStates = vm.isOfState = function(order, states){return Orders.isOfStates(order, states)};
    vm.cancelOrder = cancelOrder;
    vm.remindSendingGoods = remindSendingGoods;
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.aliPay = aliPay;
    vm.onAliPayLoadStart = onAliPayLoadStart;
    vm.onAliPayLoadStop = onAliPayLoadStop;
    vm.onAliPayFinished = onAliPayFinished;
    activate();
    
    function activate() {
      vm.orderId = $stateParams.id;
      vm.inAppBrowserEvents = {'loadstart': vm.onAliPayLoadStart, 'loadstop': vm.onAliPayLoadStop, 'exit': vm.onAliPayFinished}
      Orders.getOrderDetail(vm.orderId).then(function(data) {
        vm.order = data.order;
        vm.orderState = Orders.getOrderState(vm.order.Order.status);
        vm.cartItems = data.carts;
        vm.hasPaid = !_.isEmpty(vm.order.Order.pay_time);
        vm.totalPrice = _.reduce(vm.cartItems, function(sum, cartItem){return sum + cartItem.Cart.price}, 0);
        vm.ship_type = data.ship_type;
        vm.expired_pids = data.expired_pids;
        vm.no_more_money = data.no_more_money;
        vm.products = data.products;
        vm.store = data.store;
      });
    }
    function cancelOrder(order){
      // if(order.Order.status != 0){
      //   $log.log("cannot cancel order " +  order.Order.id + " with state " + order.Order.status);
      //   return;
      // }
      var orderId =  order.Order.id;
      Orders.cancelOrder(orderId).then(function(result){
        $rootScope.updateOrderState(orderId, 10);
        $rootScope.alertMessage("订单已取消");
        $ionicHistory.goBack();
      });
    }
    function remindSendingGoods(order){
      order.reminded = true;
      $timeout(function(){
        $rootScope.alertMessage('已经提醒卖家发货');
      }, 500);
    }
    function confirmReceivingGoods(order){
      if(order.Order.status != 2){
        $log.log("cannot confirm receiving goods for order " +  order.Order.id + " with state " + order.Order.status);
        return;
      }
      var orderId = order.Order.id;
      Orders.confirmReceivingGoods(orderId).then(function(result){
        $rootScope.updateOrderState(orderId, 3);
        $rootScope.alertMessage("已确认收货");
      });
    }
    function aliPay(){
      $log.log('pay begin');
      Users.aliPay(vm.orderId).then(function(inAppBrowser){
        vm.inAppBrowser = inAppBrowser;
        _.each(vm.inAppBrowserEvents, function(callback, event){
          vm.inAppBrowser.addEventListener(event, callback);  
        });
        $log.log(vm.inAppBrowser);
      }, function(e){$log.log(e)});
    }
    function onAliPayLoadStart(e){
      $log.log('onStart');
    }
    function onAliPayLoadStop(e){
      $log.log('onStop');
      if(e.url.match("/ali_pay/wap_return_back_app")){
        $log.log("will close in app browser...");
        vm.inAppBrowser.close();
      }
    }
    function onAliPayFinished(e){
      $log.log('onFinished');
      _.each(vm.inAppBrowserEvents, function(callback, event){
        try{
          vm.inAppBrowser.removeEventListener(event, callback);  
        }catch(e){$log.log("failed to remove event listener " + event).log(e)}
      });
      $log.log("ali pay finished, will reload order detail for order " + vm.orderId);
      $window.location.reload(true)
    }
  } 
})(window, window.angular);