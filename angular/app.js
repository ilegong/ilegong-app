// Ionic Starter App

(function(){
  angular.module('ilegong', ['ionic', 'ilegong.home', 'ilegong.my', 'ilegong.tryings', 'ilegong.sharings', 'ilegong.categories', 'ilegong.templates',"ilegong.products"])
  .run(initApp)
  .config(configStates)
  .config(extendLog)
  .config(extendExceptionHandler)
  .config(configCompileProvider)

  var state = state;
  var subState = subState;

  function initApp($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  };

  function configStates($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', state("/app", "tabs.html", AppCtrl, {abstract: true}))
      .state('app.home', {url: '/home', views: {'app-home': {templateUrl: 'home.main.html',controller: 'HomeCtrl as vm'}}})

      .state('app.category-detail', {url: '/categories/:slug',views: {'app-home': {templateUrl: 'category-detail.html',controller: 'CategoryDetailCtrl as vm'}}})

      .state('app.sharings', {url: '/sharings', views: {'app-sharings': {templateUrl: 'sharings.main.html',controller: 'SharingsCtrl'}}})
      .state('app.sharing-detail', {url: '/sharings/:id', views: {'app-sharings': {templateUrl: 'sharing-detail.html',controller: 'SharingDetailCtrl'}}})
      .state('app.sharing-detail.intro', {url: '/intro', templateUrl: 'sharing-detail-intro.html'})
      .state('app.sharing-detail.products', {url: '/products', templateUrl: 'sharing-detail-products.html'})
      
      .state('app.tryings', {url: '/tryings',views: {'app-tryings': {templateUrl: 'tryings.main.html',controller: 'TryingsCtrl'}}})
      .state('app.trying-detail', {url: '/tryings/:id',views: {'app-tryings': {templateUrl: 'trying-detail.html',controller: 'TryingDetailCtrl'}}})

      .state('app.my', {url: '/my', views: {'app-my': {templateUrl: 'my.main.html',controller: 'MyCtrl'}}})
      .state('app.my-account-login', {url: '/my/account-login', views: {'app-my': {templateUrl: 'my-account-login.html',controller: 'MyAccountLoginCtrl'}}})
      .state('app.my-account-register', {url: '/my/account-register', views: {'app-my': {templateUrl: 'my-account-register.html',controller: 'MyAccountRegisterCtrl'}}})
      .state('app.my-ilegong', {url: '/my/ilegong', views: {'app-my': {templateUrl: 'my-ilegong.html',controller: 'MyIlegongCtrl'}}})
      .state('app.my-addresses-info',{url:'/my-addresses-info',views:{'app-my':{templateUrl:'my-addresses-info.html',controller:'MyAddressesInfoCtrl'}}})
      .state('app.my-list',{url:'/my-list',views:{'app-my':{templateUrl:'my-list.html',controller:'MyListCtrl'}}})
      .state('app.my-detail',{url:'/my-detail',views:{'app-my':{templateUrl:'my-detail.html',controller:'MyDetailCtrl'}}})
      .state('app.my-carts',{url:'/my-carts',views:{'app-my':{templateUrl:'my-carts.html',controller:'MyCartsCtrl'}}})
      .state('app.my-order-info',{url:'/my-order-info',views:{'app-my':{templateUrl:'my-order-info.html',controller:'MyOrderInfoCtrl'}}})
      .state('app.my-coupons',{url:'/my-coupons',views:{'app-my':{templateUrl:'my-coupons.html',controller:'MyCouponsCtrl'}}})
      .state('app.my-offers',{url:'/my-offers',views:{'app-my':{templateUrl:'my-offers.html',controller:'MyOffersCtrl as vm'}}})
      .state('app.my-orders',{url:'/my-orders',views:{'app-my':{templateUrl:'my-orders.html',controller:'MyOrdersCtrl as vm'}}})
      .state('app.my-orders.total',{url:'/total',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unpaid',{url:'/unpaid',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unsent',{url:'/unsent',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unreceived',{url:'/unreceived',templateUrl:'my-orders-total.html'})
      .state('app.my-order-detail',{url:'/my-order-detail',views:{'app-my':{templateUrl:'my-order-detail.html',controller:'MyOrderDetailCtrl as vm'}}})

      .state('app.product-detail', {url: '/products/:id', views: {'app-home': {templateUrl: 'product-detail.html',controller: 'ProductDetailCtrl'}}})
      .state('app.product-detail.intro',{url:'/intro',templateUrl:'product-detail-intro.html'})
      .state('app.product-detail.evaluate',{url:'/evaluate',templateUrl:'product-detail-evaluate.html'});

    $urlRouterProvider.otherwise('/app/home');
  }

  /* @ngInject */
  function extendLog($provide){
    $provide.decorator('$log', function($delegate, $injector){
      var _log = $delegate.log;
      var _warn = $delegate.warn;
      var _info = $delegate.info;
      var _debug = $delegate.debug;
      var _error = $delegate.error;
      var addMessage = function(message){
        var $rootScope = $injector.get("$rootScope");
        $rootScope.messages = $rootScope.messages || [];
        $rootScope.messages.push(message);
        return message;
      }

      $delegate.log = function(msg){_log(addMessage(msg)); return this;};
      $delegate.warn = function(msg){_warn(addMessage(msg)); return this;};
      $delegate.info = function(msg){_info(addMessage(msg)); return this;};
      $delegate.debug = function(msg){_debug(addMessage(msg)); return this;};
      $delegate.error = function(msg){_error(addMessage(msg)); return this;};

      return $delegate;
    });
  }

  /* @ngInject */
  function extendExceptionHandler($provide) {
    $provide.decorator('$exceptionHandler', function($delegate, $injector, $log){
      return function (exception, cause) {
        var $rootScope = $injector.get("$rootScope");
        if(!_.isEmpty($rootScope.error)){
          $rootScope.error({message:"Exception", reason:exception});
        }
        if(!_.isEmpty($log.error)){
          $log.error(exception).error(cause);
        }
        $delegate(exception, cause);
      };
    });
  }

  /* @ngInject */
  function configCompileProvider($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https|file|blob|cdvfile|http|chrome-extension):|data:image\//);
  }

  function state(url, templateUrl, controller, options){
    return _.extend({url: url, templateUrl: templateUrl, controller: controller}, options || {});
  }
  function subState(url, templateUrl, controller, options){
    var menuContent = {templateUrl: templateUrl, controller: controller || function(){}}
    return _.extend({url: url, views: {'menuContent' : menuContent}}, options || {})
  }

  function AppCtrl($scope,$rootScope)
  {
  //address region
    $rootScope.regionSelectItems=[
                              new RegionSelectItem('beijing',1,[
                                new RegionSelectItem('beijing-1',11,[
                                  new RegionSelectItem('beijing-1-1',111,null),
                                  new RegionSelectItem('beijing-1-2',112,null)]),
                                new RegionSelectItem("beijing-2",12,[
                                  new RegionSelectItem('beijing-2-1',121,null),
                                  new RegionSelectItem('beijing-2-2',122,null)])]),
                              new RegionSelectItem('shanghai',2,[
                                new RegionSelectItem('shanghai-1',21,[
                                  new RegionSelectItem('shanghai-1-1',211,null),
                                  new RegionSelectItem('shanghai-1-2',212,null)]),
                                new RegionSelectItem('shanghai-2',22,[
                                  new RegionSelectItem('shanghai-2-1',221,null),
                                  new RegionSelectItem('shanghai-2-2',222,null)])])];
    $rootScope.getRegion_1_model=function(title)
    {
      var i=0;
      while(i<$rootScope.regionSelectItems.length)
      {
        if($rootScope.regionSelectItems[i].title == title)
        {
          return {id:i,content:$rootScope.regionSelectItems[i]};
        }
        i++;
      }
      return null;
    }
    $rootScope.getReion_2_model=function(index_1,title)
    {
      var t = $rootScope.regionSelectItems[index_1];
      var i = 0;

      while(i<t.content.length)
      {
        if(t.content[i].title==title)
        {
          return {id:i,content:t.content[i]};
        }
        i++;
      }

      return null;
    }
    $rootScope.getRegion_3_model=function(index_1,index_2,title)
    {
      var t = $rootScope.regionSelectItems[index_1].content[index_2];
      var i = 0;
      while(i<t.content.length)
      {
        if(t.content[i].title==title)
        {
          return {id:i,content:t.content[i]};
        }
        i++;
      }
      return null;
    }

  //--address region


  //orderState
    $rootScope.getOrderValue = function(pState)
    {
      for(var key in $rootScope.orderStatus)
      {
        if($rootScope.orderStatus[key].state == pState)
          return $rootScope.orderStatus[key].value;
      }
      return '';
    }
    $rootScope.orderStatus = {
      'UNPAID':{state:0,value:'未支付'},
      'PAID': {state:1,value:'已支付'},
      'SENT':{state:2,value:'已发货'},
      'RECEIVED':{state:3,value:'已收货'},
      'REFUNDED':{state:4,value:'已退款'},
      'SUCCESSED':{state:9,value:'已完成'},
      'CANCELED':{state:10,value:'已取消'},
      'VERIFIED':{state:11,value:'已确认有效'},
      'COMPLAINED':{state:12,value:'已投诉'}
    }
  //--order state

  //offer state

    $rootScope.offerStatus = {
      'UNUSED':{state:1,value:'未使用'},
      'USED':{state:2,value:'已使用'},
      'OVERDUE':{state:3,value:'已过期'}
    }
    $rootScope.getOfferValue = function(pState)
    {

      for(var key in $rootScope.offerStatus)
      {
        if($rootScope.offerStatus[key].state == pState)
          return $rootScope.offerStatus[key].value;
      }
      return '';
    }
  //--offer state
  //coupon state
    $rootScope.couponStatus = {
      'UNUSED':{state:1,value:'未使用',color:'#73a839'},
      'USED':{state:2,value:'已使用',color:'#999'},
      'OVERDUE':{state:3,value:'已过期',color:'#999'}
    }
    $rootScope.getCouponValue = function(pState)
    {

      for(var key in $rootScope.couponStatus)
      {
        if($rootScope.couponStatus[key].state==pState)
          return $rootScope.couponStatus[key].value;
      }
      return '';
    }
    $rootScope.getCouponColor = function(pState)
    {
      for(var key in $rootScope.couponStatus)
      {
        if($rootScope.couponStatus[key].state==pState)
        {
          return $rootScope.couponStatus[key].color;
        }
      }
      return '';
    }
    $rootScope.isCouponAvailable = function(pState)
    {
      return pState==$rootScope.couponStatus['UNUSED'].state?true:false;
    }
  //--coupon state
  }
})();

