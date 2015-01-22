(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyOrderDetailCtrl',MyOrderDetailCtrl)

  function MyOrderDetailCtrl($scope, $rootScope, $http, $stateParams, $log, $state, Orders, Users) {
    var vm = this;
    vm.isOfStates = vm.isOfState = function(order, states){return Orders.isOfStates(order, states)};
    vm.cancelOrder = cancelOrder;
    vm.aliPay = aliPay;
    vm.onAliPayLoadStart = onAliPayLoadStart;
    vm.onAliPayLoadStop = onAliPayLoadStop;
    vm.onAliPayFinished = onAliPayFinished;
    activate();
    
    function activate() {
      vm.orderId = $stateParams.id;
      vm.order = {};
      vm.orderState = {};
      vm.inAppBrowserEvents = {'loadstart': vm.onAliPayLoadStart, 'loadstop': vm.onAliPayLoadStop, 'exit': vm.onAliPayFinished}
      Orders.getOrderDetail(vm.orderId).then(function(data) {
        vm.order = data.order;
        vm.orderState = Orders.getOrderState(vm.order.Order.status);
        vm.cartItems = data.carts;
        vm.totalPrice = _.reduce(vm.cartItems, function(sum, cartItem){return sum + cartItem.Cart.price}, 0);
        vm.ship_type = data.ship_type;
        vm.expired_pids = data.expired_pids;
        vm.no_more_money = data.no_more_money;
        vm.products = data.products;
        vm.store = data.store;
      });
    }
    function cancelOrder(){

    }
    function aliPay(){
      Users.aliPay(vm.orderId).then(function(inAppBrowser){
        vm.inAppBrowser = inAppBrowser;
        _.each(vm.inAppBrowserEvents, function(callback, event){
          vm.inAppBrowser.addEventListener(event, callback);  
        });
      }, function(e){$log.log(e)});
    }
    function onAliPayLoadStart(e){
    }
    function onAliPayLoadStop(e){
      if(e.url.match("/ali_pay/wap_return_back_app")){
        $log.log("will close in app browser...");
        vm.inAppBrowser.close();
      }
    }
    function onAliPayFinished(e){
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