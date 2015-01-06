// Ionic Starter App

(function(){
  angular.module('ilegong', ['ionic', 'ilegong.home', 'ilegong.my', 'ilegong.tryings', 'ilegong.stores', 'ilegong.categories', 'ilegong.templates','ilegong.products','ilegong.carts','app.services'])
  .run(initApp)
  .config(configStates)
  .config(extendLog)
  .config(extendExceptionHandler)
  .config(configCompileProvider)
  .config(configLocalForage)
  .config(configHttpProvider)

  function initApp($ionicPlatform, $log, Users) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
      Users.init();
    });
  };

  function configStates($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {url: "/app", templateUrl: "tabs.html", controller: AppCtrl, abstract: true})
      .state('app.home', {url: '/home', views: {'app-home': {templateUrl: 'home.main.html',controller: 'HomeCtrl as vm'}}})

      .state('app.category-detail', {url: '/categories/:slug',views: {'app-home': {templateUrl: 'category-detail.html',controller: 'CategoryDetailCtrl as vm'}}})
      
      .state('app.tryings', {url: '/tryings',views: {'app-tryings': {templateUrl: 'tryings.main.html',controller: 'TryingsCtrl as vm'}}})
      .state('app.trying-detail', {url: '/tryings/:id',views: {'app-tryings': {templateUrl: 'trying-detail.html',controller: 'TryingDetailCtrl as vm'}}})

      .state('app.my', {url: '/my', views: {'app-my': {templateUrl: 'my.main.html',controller: 'MyCtrl as vm'}}})
      .state('app.my-account-login', {url: '/my/account-login', views: {'app-my': {templateUrl: 'my-account-login.html',controller: 'MyAccountLoginCtrl as vm'}}})
      .state('app.my-account-register', {url: '/my/account-register', views: {'app-my': {templateUrl: 'my-account-register.html',controller: 'MyAccountRegisterCtrl as vm'}}})
      .state('app.my-ilegong', {url: '/my/ilegong', views: {'app-my': {templateUrl: 'my-ilegong.html',controller: 'MyIlegongCtrl as vm'}}})
      .state('app.my-addresses-info',{url:'/my-addresses-info',views:{'app-my':{templateUrl:'my-addresses-info.html',controller:'MyAddressesInfoCtrl as vm'}}})

      .state('app.my-detail',{url:'/my-detail',views:{'app-my':{templateUrl:'my-detail.html',controller:'MyDetailCtrl as vm'}}})
      .state('app.my-detail-edit',{url:'/my-detail-edit/:state',views:{'app-my':{templateUrl:'my-detail-edit.html',controller:'MyDetailEditCtrl as vm'}}})

      .state('app.my-coupons',{url:'/my-coupons',views:{'app-my':{templateUrl:'my-coupons.html',controller:'MyCouponsCtrl as vm'}}})
      .state('app.my-offers',{url:'/my-offers',views:{'app-my':{templateUrl:'my-offers.html',controller:'MyOffersCtrl as vm'}}})
      .state('app.my-orders',{url:'/my-orders',views:{'app-my':{templateUrl:'my-orders.html',controller:'MyOrdersCtrl as vm'}}})
      .state('app.my-orders.total',{url:'/total',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unpaid',{url:'/unpaid',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unsent',{url:'/unsent',templateUrl:'my-orders-total.html'})
      .state('app.my-orders.unreceived',{url:'/unreceived',templateUrl:'my-orders-total.html'})
      .state('app.my-order-detail',{url:'/my-order-detail/:id',views:{'app-my':{templateUrl:'my-order-detail.html',controller:'MyOrderDetailCtrl as vm'}}})

      .state('app.product-detail', {url: '/products/:id/:from', views: {'app-home': {templateUrl: 'product-detail.html',controller: 'ProductDetailCtrl as vm'}}})
      .state('app.product-detail.intro',{url:'/intro',templateUrl:'product-detail-intro.html'})
      .state('app.product-detail.evaluate',{url:'/evaluate',templateUrl:'product-detail-evaluate.html'})

      .state('app.product-detail-o', {url: '/products-o/:id/:from', views: {'app-my': {templateUrl: 'product-detail.html',controller: 'ProductDetailCtrl as vm'}}})
      .state('app.product-detail-o.intro',{url:'/intro',templateUrl:'product-detail-intro.html'})
      .state('app.product-detail-o.evaluate',{url:'/evaluate',templateUrl:'product-detail-evaluate.html'})


      .state('app.shopping-carts', {url: '/shoppingCarts', views: {'app-shopping-carts': {templateUrl: 'shopping-carts.html',controller: 'ShoppingCartsCtrl as vm'}}})
      .state('app.order-info',{url:'/order-info',views:{'app-shopping-carts':{templateUrl:'my-order-info.html',controller:'OrderInfoCtrl as vm'}}})

      .state('app.stores', {url: '/stores', views: {'app-stores': {templateUrl: 'stores.main.html', controller: 'StoresCtrl as vm'}}})
      .state('store', {url: '/stores/:storeId', templateUrl: 'store.html', controller: 'StoreCtrl as app', abstract: true})
      .state('store.home', {url: '/home', views: {'store-home': {templateUrl: 'store.home.html', controller: 'StoreHomeCtrl as vm'}}})
      .state('store.intro', {url: '/intro', views: {'store-intro': {templateUrl: 'store.intro.html', controller: 'StoreIntroCtrl as vm'}}})
      .state('store.product-detail', {url: '/products/:id/:from', views: {'store-home': {templateUrl: 'product-detail.html',controller: 'ProductDetailCtrl as vm'}}})
      .state('store.product-detail.intro',{url:'/intro',templateUrl:'product-detail-intro.html'})
      .state('store.product-detail.evaluate',{url:'/evaluate',templateUrl:'product-detail-evaluate.html'})

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

  /* @ngInject */
  function configLocalForage($localForageProvider){
    $localForageProvider.config({
      name        : 'ilegong',
    });
  }

  /* @ngInject */
  function configHttpProvider($httpProvider){
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
  }

  function AppCtrl($scope,$rootScope,Orders)
  {
    //address info
    $rootScope.allProvince = function()
    {
      var provinces = Array();
      Orders.allProvince().then(function(data){
          var provincesT = data ;
          for(var zzz in provincesT)
          {
            provinces.push({'id':zzz,'name':provincesT[zzz]});
          }
      });
      return provinces;
    }
    $rootScope.getCities = function(id)
    {
      var cities = Array();
      Orders.getCities(id).then(function(data){
        var citiesT = data;
        for(var zzz in citiesT)
        {
          cities.push({'id':zzz,'name':citiesT[zzz]});
        }
      }
      );
      return cities;
    }
    $rootScope.getCounties = function(id)
    {
      var counties = Array();
      Orders.getCounties(id).then(function(data)
      {
        var countiesT = data;
        for(var zzz in countiesT)
        {
          counties.push({id:zzz,name:countiesT[zzz]});
        }
      });
      return counties;
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
      'NEW':{state:0,value:'新的'},
      'GOING':{state:3,value:'可以使用'},
      'EXPIRED':{state:1,value:'已过期'},
      'INVALID':{state:2,value:'已失效'}
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
    $rootScope.OfferIsValid = function(status)
    {
      if(status == $rootScope.offerStatus['NEW'].state || status == $rootScope.offerStatus['GOING'].state)
      {
        return true;
      }

      return false;
    }
  //--offer state
  //coupon state
    $rootScope.couponStatus = {
      'VALID':{state:1,value:'有效',color:'#73a839'},
      'TO_USE':{state:1,value:'可用',color:'#73a839'},
      'USED':{state:2,value:'已使用',color:'#999'},
      'TO_SEND':{state:3,value:'TO_SEND',color:'#999'},
      'SENT':{state:1,value:'SENT',color:'#999'}
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
      return (pState==$rootScope.couponStatus['TO_USE'].state == pState || $rootScope.couponStatus['VALID'].state == pState);
    }
  //--coupon state
  }

})();

