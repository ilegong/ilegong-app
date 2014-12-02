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
      .state('app', state("/app", "tabs.html", appCtrl, {abstract: true}))
      .state('app.home', {url: '/home', views: {'app-home': {templateUrl: 'home.main.html',controller: 'HomeCtrl'}}})

      .state('app.categories', {url: '/categories',views: {'app-categories': {templateUrl: 'categories.main.html',controller: 'CategoriesCtrl'}}})
      .state('app.category-detail', {url: '/categories/:id',views: {'app-categories': {templateUrl: 'category-detail.html',controller: 'CategoryDetailCtrl'}}})

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
      .state('app.my-offers',{url:'/my-offers',views:{'app-my':{templateUrl:'my-offers.html',controller:'MyOffersCtrl'}}})
      .state('app.my-orders',{url:'/my-orders',views:{'app-my':{templateUrl:'my-orders.html',controller:'MyOrdersCtrl'}}})
      .state('app.my-orders.total',{url:'/total',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unpaid',{url:'/unpaid',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unsent',{url:'/unsent',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unreceived',{url:'/unreceived',templateUrl:'my-orders-total.html'})
      .state('app.my-order-detail',{url:'/my-order-detail',views:{'app-my':{templateUrl:'my-order-detail.html',controller:'MyOrderDetailCtrl'}}})

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
    $compileProvider.imgSrcSanitizationWhitelist(/^\s(https|file|blob|cdvfile|http):|data:image\//);
  }

  function state(url, templateUrl, controller, options){
    return _.extend({url: url, templateUrl: templateUrl, controller: controller}, options || {});
  }
  function subState(url, templateUrl, controller, options){
    var menuContent = {templateUrl: templateUrl, controller: controller || function(){}}
    return _.extend({url: url, views: {'menuContent' : menuContent}}, options || {})
  }

  function appCtrl($scope,$rootScope)
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
    $rootScope.orderState = [
      {state:1,string:'已确认有效'},
      {state:2,string:'等待付款'},
      {state:3,string:'已付款'},
      {state:4,string:'已发货'},
      {state:5,string:'已收货'},
      {state:6,string:'已取消'}
    ]

    $rootScope.getOrderString = function(pState)
    {
      var i =0;
      while(i<$scope.orderState.length)
      {
        if($scope.orderState[i].state == pState)
          return $scope.orderState[i].string;
        i++;
      }
      return '';
    }
    $rootScope.getOrderState_VERIFIED = function()
    {
      return 1;
    }
    $rootScope.getOrderState_UNPAID = function()
    {
      return 2;
    }
    $rootScope.getOrderState_PAID = function()
    {
      return 3;
    }
    $rootScope.getOrderState_SENT = function()
    {
      return 4;
    }
    $rootScope.getOrderState_RECEIVED = function()
    {
      return 5;
    }
    $rootScope.getOrderState_CANCELED = function()
    {
      return 6;
    }
  //--order state

  //offer state

    $rootScope.offerState = [
      new OfferState(1,'未使用'),
      new OfferState(2,'已使用'),
      new OfferState(3,'已过期')
    ]
    $rootScope.getOfferString = function(pState)
    {
      var i =0;
      while(i<$rootScope.offerState.length)
      {
        if($rootScope.offerState[i].state == pState)
          return $rootScope.offerState[i].string;
        i++;
      }
      return '';
    }
    $rootScope.getOfferState_UNUSED = function()
    {
      return 1;
    }
  //--offer state
  //coupon state
    $rootScope.couponsState = [
      new CouponState(1,'未使用','#73a839'),
   
      new CouponState(2,'已使用','#999'),
      new CouponState(3,'已过期','#999')
    ]
    $rootScope.getStateString = function(pState)
    {
      var i =0;
      while(i<$rootScope.couponsState.length)
      {
        if($rootScope.couponsState[i].state==pState)
          return $rootScope.couponsState[i].string;
        i++;
      }
      return '';
    }
    $rootScope.getStateColor = function(pState)
    {

            var i =0;
      while(i<$rootScope.couponsState.length)
      {
        if($rootScope.couponsState[i].state==pState)
        {
          
          return $rootScope.couponsState[i].color;
        }
        i++;
      }
      return '';
    }
    $rootScope.isCouponAvailable = function(pState)
    {
      return pState==1?true:false;
    }
  //--coupon state
  }
})();

