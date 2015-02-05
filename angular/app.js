// Ionic Starter App

(function(window, angular, cordova){
  angular.module('ilegong', ['ionic', 'ilegong.home', 'module.my', 'module.tryings', 'module.stores', 'ilegong.templates','module.products','module.cart','module.services', 'module.directives'])
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
      if(cordova && cordova.plugins.Keyboard) {
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
      .state('app.home', {url: '/home', views: {'app-home': {templateUrl: 'home.main.html',controller: 'HomeMainCtrl as vm'}}})
      .state('app.home-category', {url: '/categories/:slug/:name',views: {'app-home': {templateUrl: 'home-category.html',controller: 'HomeCategoryCtrl as vm'}}})
   
      .state('app.stores', {url: '/stores', views: {'app-stores': {templateUrl: 'stores.main.html', controller: 'StoreMainCtrl as vm'}}})
   
      .state('app.tryings', {url: '/tryings',views: {'app-tryings': {templateUrl: 'tryings.main.html',controller: 'TryingsCtrl as vm'}}})
      .state('app.trying-detail', {url: '/tryings/:id',views: {'app-tryings': {templateUrl: 'trying-detail.html',controller: 'TryingDetailCtrl as vm'}}})

      .state('app.cart', {url: '/cart', views: {'app-cart': {templateUrl: 'cart-main.html',controller: 'CartMainCtrl as vm'}}})
      .state('app.cart-confirmation',{url:'/cart-confirmation',views:{'app-cart':{templateUrl:'cart-confirmation.html',controller:'CartConfirmationCtrl as vm'}}})

      .state('app.my', {url: '/my', views: {'app-my': {templateUrl: 'my.main.html',controller: 'MyMainCtrl as vm'}}})
      .state('app.my-ilegong', {url: '/my/ilegong', views: {'app-my': {templateUrl: 'my-ilegong.html',controller: 'MyIlegongCtrl as vm'}}})
      .state('app.my-log', {url: '/my/log', views: {'app-my': {templateUrl: 'my-log.html',controller: 'MyLogCtrl as vm'}}})
      .state('app.my-profile',{url:'/my-profile',views:{'app-my':{templateUrl:'my-profile.html',controller:'MyProfileCtrl as vm'}}})
      .state('app.my-profile-mobilephone',{url:'/my-profile-mobilephone',views:{'app-my':{templateUrl:'my-profile-mobilephone.html',controller:'MyProfileMobilePhoneCtrl as vm'}}})
      .state('app.my-profile-email',{url:'/my-profile-email',views:{'app-my':{templateUrl:'my-profile-email.html',controller:'MyProfileEmailCtrl as vm'}}})
      .state('app.my-profile-sex',{url:'/my-profile-sex',views:{'app-my':{templateUrl:'my-profile-sex.html',controller:'MyProfileSexCtrl as vm'}}})
      .state('app.my-profile-nickname',{url:'/my-profile-nickname',views:{'app-my':{templateUrl:'my-profile-nickname.html',controller:'MyProfileNickNameCtrl as vm'}}})
      .state('app.my-coupons',{url:'/my-coupons',views:{'app-my':{templateUrl:'my-coupons.html',controller:'MyCouponsCtrl as vm'}}})
      .state('app.my-offers',{url:'/my-offers',views:{'app-my':{templateUrl:'my-offers.html',controller:'MyOffersCtrl as vm'}}})

      .state('product-detail', {url: '/products/:id/:from', templateUrl: 'product-detail.html', controller: 'ProductDetailCtrl as vm'})
      .state('product-detail.intro', {url:'/intro', views:{'app-home':{templateUrl:'product-detail-intro.html'}}})
      .state('product-detail.evaluate', {url:'/evaluate', views:{'app-home':{templateUrl:'product-detail-evaluate.html'}}})
      .state('product-detail-comments', {url:'/products/:id/:from/comments/:type', templateUrl: 'product-detail-comments.html', controller:'ProductDetailCommentsCtrl as vm'})

      .state('account-login', {url: '/account-login', templateUrl: 'my-account-login.html',controller: 'MyAccountLoginCtrl as vm'})
      .state('account-register', {url: '/account-register', templateUrl: 'my-account-register.html',controller: 'MyAccountRegisterCtrl as vm'})

      .state('addresses',{url:'/addresses/:state', templateUrl:'my-addresses.html',controller:'MyAddressesCtrl as vm'})
      .state('address-edit',{url:'/address-edit/:editId', templateUrl:'my-address-edit.html',controller:'MyAddressEditCtrl as vm'})

      .state('orders',{url:'/orders/:state', templateUrl:'my-orders.html', controller:'MyOrdersCtrl as vm'})
      .state('order-detail',{url:'/order/:id', templateUrl:'my-order-detail.html', controller:'MyOrderDetailCtrl as vm'})

      .state('store', {url: '/stores/:storeId/:name', templateUrl: 'store-tabs.html', controller: 'StoreDetailCtrl as app', abstract: true})
      .state('store.home', {url: '/home', views: {'store-home': {templateUrl: 'store.home.html', controller: 'StoreHomeCtrl as vm'}}})
      .state('store.intro', {url: '/intro', views: {'store-intro': {templateUrl: 'store.intro.html', controller: 'StoreIntroCtrl as vm'}}})

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
    $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
  }

  function AppCtrl($q,$scope,$rootScope, $timeout, $ionicPopup, $log, $state, config, Base, Orders, Carts, Users, Addresses, Profile, Stores) {
    var app = $scope;
    app.toHomePage = toHomePage;
    app.toStoresPage = toStoresPage;
    app.toTryingsPage = toTryingsPage;
    app.toCartPage = toCartPage;
    app.toMyPage = toMyPage;
    activate();

    function activate(){
      $rootScope.config = config;
      $rootScope._ = window._;
      $rootScope.hideTabs = [];
      $rootScope.user = $rootScope.user || {token:{}, loggedIn: false, profile:{}, cartItems: [], addresses: [], orders: [], order_carts: [], ship_type: {}};
      $rootScope.brands = [];
      $rootScope.provinces = [];
      $rootScope.alert = {message: ''};

      Base.getLocal('token').then(function(token){
        if(_.isEmpty(token)){
          return;
        }

        var isExpired = token.expires_at <= (((new Date()).valueOf())/1000);
        if(isExpired){
          return Users.refreshToken(token.refresh_token);
        }

        $rootScope.user.token = token;
        Base.getLocal('profile').then(function(profile){
          $rootScope.user.profile = profile;
        });
        $rootScope.onUserLoggedIn(token, false);
      }, function(e){});
      Stores.list().then(function(data){
        $rootScope.brands = data.brands;
      });
      Addresses.getProvinces().then(function(provinces){
        $rootScope.provinces = provinces;
      });
    }
    $rootScope.onUserLoggedIn = function(token, shouldRefreshToken){
      if(shouldRefreshToken){
        token = _.extend(token, {expires_at: token.expires_in + ((new Date()).valueOf())/1000});
        Base.setLocal('token', token);
      }
      $rootScope.user.token = token;
      $rootScope.user.loggedIn = true;

      $rootScope.reloadProfile(token.access_token);
      $rootScope.reloadCart(token.access_token);
      $rootScope.reloadAddresses(token.access_token);
      $rootScope.reloadOrders(token.access_token);
    }
    $rootScope.onUserLoggedOut = function(){
      $rootScope.user = {token:{}, loggedIn: false, profile:{}, cartItems: [], addresses: [], orders: [], order_carts: [], ship_type: {}};
    }
    $rootScope.reloadProfile = function(accessToken){
      Profile.getProfile(accessToken).then(function(profile){
        $rootScope.user.profile = profile;
      });
    }
    $rootScope.reloadCart = function(accessToken){
      return Carts.getCartItems(accessToken).then(function(result){
        $rootScope.user.cartItems = _.map(result.carts, function(cartItem){cartItem.checked = true; return cartItem;});
      });
    }
    $rootScope.reloadAddresses = function(accessToken){
      return Addresses.list(accessToken).then(function(addresses){
        $rootScope.user.addresses = addresses;
        $rootScope.$broadcast('addressChanged', addresses);
      });
    }
    $rootScope.reloadOrders = function(accessToken){
      return Orders.list(accessToken).then(function(data){
        $rootScope.user.orders = data.orders;
        $rootScope.user.order_carts = data.order_carts;
        $rootScope.user.ship_type = data.ship_type;
      });
    }
    $rootScope.getDefaultAddress = function(){
      var defaultAddress =  _.find($rootScope.user.addresses, function(address){return address.OrderConsignees.status == 1});
      if(_.isEmpty(defaultAddress) && $rootScope.user.addresses.length > 0){
        defaultAddress = $rootScope.user.addresses[0];
      }
      return defaultAddress || {};
    }
    $rootScope.updateOrderState = function(orderId, state){
      var order = _.find($rootScope.user.orders, function(order){return order.Order.id == orderId});
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
    function toHomePage(){
      $rootScope.hideTabs = [];
      $state.go('app.home');
    }
    function toStoresPage(){
      $rootScope.hideTabs = [];
      $state.go('app.stores');
    }
    function toTryingsPage(){
      $rootScope.hideTabs = [];
      $state.go('app.tryings');
    }
    function toCartPage(){
      $rootScope.hideTabs = [];
      $state.go('app.cart');
    }
    function toMyPage(){
      $rootScope.hideTabs = [];
      $state.go('app.my');
    }
  }
})(window, window.angular, window.cordova);

