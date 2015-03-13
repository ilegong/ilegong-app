(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('OrderDetailCtrl', OrderDetailCtrl)

  function OrderDetailCtrl($ionicActionSheet, $timeout,$scope, $rootScope, $http, $stateParams, $log, $state, $ionicHistory, $filter, config, Orders, Users) {
    var vm = this;
    vm.isOfStates = vm.isOfState = function(order, states){return Orders.isOfStates(order, states)};
    vm.cancelOrder = cancelOrder;
    vm.remindSendingGoods = remindSendingGoods;
    vm.confirmReceivingGoods = confirmReceivingGoods;
    vm.removeOrder = removeOrder;
    vm.aliPay = aliPay;
    vm.onAliPayLoadStart = onAliPayLoadStart;
    vm.onAliPayLoadStop = onAliPayLoadStop;
    vm.onAliPayFinished = onAliPayFinished;
    vm.toProductDetailPage = toProductDetailPage;
    vm.toStoreHomePage = function(store){$state.go('store.home', {id: store.id, name: store.name})};
    vm.callHotline = callHotline;
    vm.getShipFee = getShipFee;
    vm.loadData = loadData;
    activate();
    
    function activate() {
      vm.orderId = $stateParams.id;
      vm.inAppBrowserEvents = {'loadstart': vm.onAliPayLoadStart, 'loadstop': vm.onAliPayLoadStop, 'exit': vm.onAliPayFinished}

      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }
    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      Orders.getOrderDetail(vm.orderId, $rootScope.user.token.access_token).then(function(data) {
        vm.order = data.order;
        vm.orderState = Orders.getOrderState(vm.order.Order.status);
        vm.cartItems = data.carts;
        vm.hasPaid = !_.isEmpty(vm.order.Order.pay_time);
        vm.ship_type = data.ship_type;
        vm.expired_pids = data.expired_pids;
        vm.no_more_money = data.no_more_money;
        vm.products = data.products;
        vm.store = data.store;
        $rootScope.updateOrderState(vm.orderId, vm.order.Order.status);

        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
    }
    function callHotline(){
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: "<b>" + config.app.hotline + "</b>" }
       ],
       titleText: '<b>朋友说竭诚为您服务</b><p/>服务时间周一至周六9:00 - 18:00',
       cancelText: '取消',
       cancel: function() {},
       buttonClicked: function(index) {
          window.open('tel:' + config.app.hotline, '_system');
         return true;
       }
     });
     $timeout(function() {
       hideSheet();
     }, 5000);
    }
    function cancelOrder(order){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      var orderId =  order.Order.id;
      Orders.cancelOrder(orderId, $rootScope.user.token.access_token).then(function(result){
        $rootScope.updateOrderState(orderId, 10);
        $rootScope.alertMessage("订单已取消");
        $ionicHistory.goBack();
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? "网络连接不可用，请稍后重试" : "取消订单失败，请重试");
      });
    }
    function remindSendingGoods(order){
      Base.ping().then(function(){
        $rootScope.alertMessage('已经提醒卖家发货');
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? "网络连接不可用，请稍后重试" : "提醒卖家发货失败，请重试");
      })
    }
    function confirmReceivingGoods(order){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      if(order.Order.status != 2){
        $log.log("cannot confirm receiving goods for order " +  order.Order.id + " with state " + order.Order.status);
        return;
      }
      var orderId = order.Order.id;
      Orders.confirmReceivingGoods(orderId, $rootScope.user.token.access_token).then(function(result){
        $rootScope.updateOrderState(orderId, 3);
        $rootScope.alertMessage("已确认收货");
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? "网络连接不可用，请稍后重试" : "确认收货失败，请重试");
      });
    }
    function removeOrder(order){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      if(order.Order.status != 4 && order.Order.status != 10){
        $log.log("cannot remove order " +  order.Order.id + " with state " + order.Order.status);
        return;
      }

      var orderId = order.Order.id;
      Orders.removeOrder(orderId, $rootScope.user.token.access_token).then(function(){
        $rootScope.reloadOrders($rootScope.user.token.access_token).catch(function(e){
          $rootScope.removeOrder(orderId);
        }).finally(function(){
          $rootScope.alertMessage("已删除订单");
          $ionicHistory.goBack();
        });        
      }, function(e){
        $rootScope.alertMessage(e.status == 0 ? "网络连接不可用，请稍后重试" : "删除订单失败，请重试");
      });
    }
    function aliPay(){
      Users.aliPay(vm.orderId).then(function(inAppBrowser){
        vm.inAppBrowser = inAppBrowser;
        _.each(vm.inAppBrowserEvents, function(callback, event){
          vm.inAppBrowser.addEventListener(event, callback);  
        });
        $log.log(vm.inAppBrowser);
      }, function(e){$log.log(e)});
    }
    function onAliPayLoadStart(e){
    }
    function onAliPayLoadStop(e){
      if(e.url.match("/ali_pay/wap_return_back") || e.url.match("/users/login")){
        $log.log("onAliPayLoadStop, will close in app browser...");
        vm.inAppBrowser.close();
      }
    }
    function onAliPayFinished(e){
      _.each(vm.inAppBrowserEvents, function(callback, event){
        try{
          vm.inAppBrowser.removeEventListener(event, callback);  
        }catch(e){$log.log("failed to remove event listener " + event).log(e)}
      });
      $rootScope.alertMessage("支付结束，正在更新订单");
      vm.loadData();
    }
    function getShipFee(order){
      if(_.isEmpty(order) || _.isEmpty(order.Order)){
        return $filter('currency')(0, '￥');
      }
      if(order.Order.ship_fee == -2){
        return '自提';
      }
      else if(order.Order.ship_fee == -1){
        return '货到付款';
      }
      return $filter('currency')(order.Order.ship_fee, '￥')
    }
    function toProductDetailPage(item){
      if(vm.order.Order.type == 5){
        $rootScope.alertMessage('团购商品，暂时不能查看详情');
        return;
      }
      $state.go("product-detail",{id: item.Cart.product_id, from:-2})
    }
  } 
})(window, window.angular);