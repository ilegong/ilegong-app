// Ionic Starter App

(function(window, angular){
  angular.module('ilegong', ['ionic', 'ilegong.home', 'module.my', 'module.tryings', 'module.stores', 'ilegong.categories', 'ilegong.templates','module.products','module.cart','module.services', 'module.directives'])
  .run(initApp)
  .config(configStates)
  .config(configApp)
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
    });
  };

  function configStates($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {url: "/app", templateUrl: "tabs.html", controller: AppCtrl, abstract: true})
      .state('app.home', {url: '/home', views: {'app-home': {templateUrl: 'home.main.html',controller: 'HomeCtrl as vm'}}})

      .state('app.category-detail', {url: '/categories/:slug',views: {'app-home': {templateUrl: 'category-detail.html',controller: 'CategoryDetailCtrl as vm'}}})
      
      .state('app.tryings', {url: '/tryings',views: {'app-tryings': {templateUrl: 'tryings.main.html',controller: 'TryingsCtrl as vm'}}})
      .state('app.trying-detail', {url: '/tryings/:id',views: {'app-tryings': {templateUrl: 'trying-detail.html',controller: 'TryingDetailCtrl as vm'}}})

      .state('app.my', {url: '/my', views: {'app-my': {templateUrl: 'my.main.html',controller: 'MyMainCtrl as vm'}}})
      .state('app.my-account-login', {url: '/my/account-login', views: {'app-my': {templateUrl: 'my-account-login.html',controller: 'MyAccountLoginCtrl as vm'}}})
      .state('app.my-account-register', {url: '/my/account-register', views: {'app-my': {templateUrl: 'my-account-register.html',controller: 'MyAccountRegisterCtrl as vm'}}})
      .state('app.my-ilegong', {url: '/my/ilegong', views: {'app-my': {templateUrl: 'my-ilegong.html',controller: 'MyIlegongCtrl as vm'}}})
      .state('app.my-addresses',{url:'/my-addresses/:state',views:{'app-my':{templateUrl:'my-addresses.html',controller:'MyAddressesCtrl as vm'}}})
      .state('app.my-address-edit',{url:'/my-address-edit/:editId',views:{'app-my':{templateUrl:'my-address-edit.html',controller:'MyAddressEditCtrl as vm'}}})
      .state('app.my-address-add',{url:'/my-address-add',views:{'app-my':{templateUrl:'my-address-edit.html',controller:'MyAddressEditCtrl as vm'}}})

      .state('app.my-profile',{url:'/my-profile',views:{'app-my':{templateUrl:'my-profile.html',controller:'MyProfileCtrl as vm'}}})
      .state('app.my-profile-edit',{url:'/my-profile-edit/:state',views:{'app-my':{templateUrl:'my-profile-edit.html',controller:'MyProfileEditCtrl as vm'}}})

      .state('app.my-coupons',{url:'/my-coupons',views:{'app-my':{templateUrl:'my-coupons.html',controller:'MyCouponsCtrl as vm'}}})
      .state('app.my-offers',{url:'/my-offers',views:{'app-my':{templateUrl:'my-offers.html',controller:'MyOffersCtrl as vm'}}})
      .state('app.my-orders',{url:'/my-orders/:state',views:{'app-my':{templateUrl:'my-orders.html',controller:'MyOrdersCtrl as vm'}}})
      .state('app.my-order-detail',{url:'/my-order-detail/:id',views:{'app-my':{templateUrl:'my-order-detail.html',controller:'MyOrderDetailCtrl as vm'}}})

      .state('app.product-detail', {url: '/products/:id/:from', views: {'app-home': {templateUrl: 'product-detail.html',controller: 'ProductDetailCtrl as vm'}}})
      .state('app.product-detail.intro',{url:'/intro',templateUrl:'product-detail-intro.html'})
      .state('app.product-detail.evaluate',{url:'/evaluate',templateUrl:'product-detail-evaluate.html'})
      .state('app.product-detail-comments',{url:'/products/:id/:from/comments/:type',views:{'app-home':{templateUrl: 'product-detail-comments.html',controller:'ProductDetailCommentsCtrl as vm'}}})

      .state('app.product-detail-o', {url: '/products-o/:id/:from', views: {'app-my': {templateUrl: 'product-detail.html',controller: 'ProductDetailCtrl as vm'}}})
      .state('app.product-detail-o.intro',{url:'/intro',templateUrl:'product-detail-intro.html'})
      .state('app.product-detail-o.evaluate',{url:'/evaluate',templateUrl:'product-detail-evaluate.html'})
      .state('app.product-detail-comments-o',{url:'/products/:id/:from/comments/:type',views:{'app-my':{templateUrl: 'product-detail-comments.html',controller:'ProductDetailCommentsCtrl as vm'}}})

      .state('app.cart', {url: '/cart', views: {'app-cart': {templateUrl: 'cart-main.html',controller: 'CartMainCtrl as vm'}}})
      .state('app.cart-confirmation',{url:'/cart-confirmation',views:{'app-cart':{templateUrl:'cart-confirmation.html',controller:'CartConfirmationCtrl as vm'}}})
      .state('app.order-addresses',{url:'/order-addresses/:state/:addrId',views:{'app-cart':{templateUrl:'my-addresses.html',controller:'MyAddressesCtrl as vm'}}})
      .state('app.order-address-edit',{url:'/order-address-edit/:editId',views:{'app-cart':{templateUrl:'my-address-edit.html',controller:'MyAddressEditCtrl as vm'}}})
      .state('app.cart-order-detail',{url:'/cart-order-detail/:id',views:{'app-cart':{templateUrl:'my-order-detail.html',controller:'MyOrderDetailCtrl as vm'}}})
      .state('app.cart-orders',{url:'/cart-orders/:state',views:{'app-cart':{templateUrl:'my-orders.html',controller:'MyOrdersCtrl as vm'}}})
      .state('app.cart-account-login', {url: '/cart-account-login', views: {'app-cart': {templateUrl: 'my-account-login.html',controller: 'MyAccountLoginCtrl as vm'}}})

      .state('app.stores', {url: '/stores', views: {'app-stores': {templateUrl: 'stores.main.html', controller: 'StoreMainCtrl as vm'}}})
      .state('store', {url: '/stores/:storeId', templateUrl: 'store-tabs.html', controller: 'StoreDetailCtrl as app', abstract: true})
      .state('store.home', {url: '/home', views: {'store-home': {templateUrl: 'store.home.html', controller: 'StoreHomeCtrl as vm'}}})
      .state('store.intro', {url: '/intro', views: {'store-intro': {templateUrl: 'store.intro.html', controller: 'StoreIntroCtrl as vm'}}})
      .state('store.product-detail', {url: '/products/:id/:from', views: {'store-home': {templateUrl: 'product-detail.html',controller: 'ProductDetailCtrl as vm'}}})
      .state('store.product-detail.intro',{url:'/intro',templateUrl:'product-detail-intro.html'})
      .state('store.product-detail.evaluate',{url:'/evaluate',templateUrl:'product-detail-evaluate.html'})
      .state('store.product-detail-comments',{url:'/products/:id/:from/comments/:type',views:{'store-home':{templateUrl: 'product-detail-comments.html',controller:'ProductDetailCommentsCtrl as vm'}}})

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

  /* @ngInject */
  function configApp($ionicConfigProvider){
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center')
  }

  function AppCtrl(Carts,Users,$q,$scope,$rootScope, $timeout, config, Orders) {
    $rootScope.config = config;
    $rootScope.cart = $rootScope.cart || {cartItems:[], brands:[]};
    $rootScope.addresses = $rootScope.addresses || [];
    $rootScope.orders = {orders: [], brands: [], order_carts: [], ship_type: {}};
    $rootScope.myMain = $rootScope.myMain || {defer:{}};
    $rootScope.user = $rootScope.user || {token:{}, user:{}}
    $rootScope.alert = {message: ''};
    $rootScope.productDetailComment = $rootScope.productDetailComment || {data:[],flag:0};
    Users.init();
    Carts.init();
    $rootScope.updateCart = function(result){
      $rootScope.cart.cartItems = _.map(result.carts, function(cartItem){cartItem.checked = true; return cartItem;});
      $rootScope.cart.brands = result.brands;
    }
    $rootScope.getDefaultAddress = function(){
      var defaultAddress =  _.find($rootScope.addresses, function(address){return address.OrderConsignees.status == 1});
      if(_.isEmpty(defaultAddress) && $rootScope.addresses.length > 0){
        defaultAddress = $rootScope.addresses[0];
      }
      return defaultAddress || {OrderConsignees: {}};
    }
    $rootScope.updateOrderState = function(orderId, state){
      var order = _.find($rootScope.orders.orders, function(order){return order.Order.id == orderId});
      if(_.isEmpty(order)){
        return;
      }
      order.Order.status = state;
      $rootScope.$broadcast('orderStateChanged', order);
    }
    $rootScope.alertMessage = function(message){
      $rootScope.alert.message = message;
      $timeout(function(){
        $rootScope.alert.message = "";
      }, config.timeout);
    }
  }
})(window, window.angular);

