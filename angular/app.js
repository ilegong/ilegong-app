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
      .state('app.my-messages', {url: '/my/messages', views: {'app-my': {templateUrl: 'my-messages.html',controller: 'MyMessagesCtrl as vm'}}})
      .state('app.my-message', {url: '/my/messages/:id', views: {'app-my': {templateUrl: 'my-message.html',controller: 'MyMessageCtrl as vm'}}})
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

      .state('store', {url: '/stores/:id/:name', templateUrl: 'store-tabs.html', controller: 'StoreCtrl as app', abstract: true})
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

  function AppCtrl($q,$scope,$rootScope, $timeout, $ionicPopup, $log, $state, config, Base, Orders, Carts, Users, Addresses, Profile, Stores, Tryings) {
    var app = $scope;
    app.toHomePage = toHomePage;
    app.toStoresPage = toStoresPage;
    app.toTryingsPage = toTryingsPage;
    app.toCartPage = toCartPage;
    app.toMyPage = toMyPage;

    $rootScope.refreshData = refreshData;
    $rootScope.onUserLoggedIn = onUserLoggedIn;
    $rootScope.onUserLoggedOut = onUserLoggedOut;
    $rootScope.reloadProfile = reloadProfile;
    $rootScope.reloadProvinces = reloadProvinces;
    $rootScope.reloadStores = reloadStores;
    $rootScope.reloadCart = reloadCart;
    $rootScope.reloadOrders = reloadOrders;
    $rootScope.reloadAddresses = reloadAddresses;
    $rootScope.reloadTryings = reloadTryings;
    $rootScope.getCartInfo = getCartInfo;
    $rootScope.getDefaultAddress = getDefaultAddress;
    $rootScope.updateOrderState = updateOrderState;
    $rootScope.alertMessage = alertMessage;
    $rootScope.showAlertMessage = showAlertMessage;
    $rootScope.toStoreHomePage = toStoreHomePage;

    activate();

    function activate(){
      $rootScope.config = config;
      if(cordova && cordova.plugins.version) {
        $rootScope.config.app = _.extend($rootScope.config.app, {version: cordova.plugins.version.getAppVersion()});
      }
      $rootScope._ = window._;
      $rootScope.hideTabs = [];
      $rootScope.user = $rootScope.user || {token:{}, loggedIn: false, profile:{}, cartItems: [], cartBrands: [], addresses: [], orders: [], order_carts: [], ship_type: {}};
      $rootScope.brands = [];
      $rootScope.provinces = [];
      $rootScope.alert = {message: ''};

      $rootScope.refreshData();
    }
    function refreshData(){
      Base.getLocal('user.token').then(function(token){
        if(_.isEmpty(token)){
          return;
        }
        var isExpired = token.expires_at <= (((new Date()).valueOf())/1000);
        if(isExpired){
          Users.refreshToken(token.refresh_token).then(function(token){
          }, function(e){
            $rootScope.onUserLoggedIn(token, false);
          });
        }
        else{
          $rootScope.user.token = token;
          $rootScope.onUserLoggedIn(token, false);
        }
      }, function(e){});

      $rootScope.reloadStores();
      $rootScope.reloadProvinces();
      $rootScope.reloadTryings();
    }
    function onUserLoggedIn(token, shouldRefreshToken){
      if(shouldRefreshToken){
        token = _.extend(token, {expires_at: token.expires_in + ((new Date()).valueOf())/1000});
        Base.setLocal('user.token', token);
        $rootScope.user.token = token;
      }
      $rootScope.user.loggedIn = !_.isEmpty($rootScope.user.token);

      $rootScope.reloadProfile(token.access_token);
      $rootScope.reloadCart(token.access_token);
      $rootScope.reloadAddresses(token.access_token);
      $rootScope.reloadOrders(token.access_token);
    }
    function onUserLoggedOut(){
      $rootScope.user = {token:{}, loggedIn: false, profile:{}, cartItems: [], cartBrands:[], addresses: [], orders: [], order_carts: [], ship_type: {}};
    }
    function reloadProfile(accessToken){
      return Profile.getProfile(accessToken).then(function(profile){
        $rootScope.user.profile = profile;
        Base.setLocal('user.profile', profile);
      }, function(e){
        Base.getLocal('user.profile').then(function(profile){
          $rootScope.user.profile = profile;
        });
      });
    }
    function reloadStores(){
      if(!_.isEmpty($rootScope.brands)){
        return;
      }

      return Stores.list().then(function(data){
        $log.log("get brands successfuly ").log(data.brands);
        $rootScope.brands = data.brands;
        Base.setLocal('brands', data.brands);
      }, function(e){
        $log.log("get brands failed: ").log(e);
        Base.getLocal('brands').then(function(brands){
          $log.log("get brands locally ").log(brands);
          $rootScope.brands = brands;
        });
      });
    }
    function reloadTryings(){
      if(!_.isEmpty($rootScope.tryings)){
        return;
      }
      return Tryings.list().then(function(data){
        $rootScope.tryings = data.cates;
        Base.setLocal('tryings', data.cates);
      }, function(e){
        Base.getLocal('tryings').then(function(tryings){
          $rootScope.tryings = tryings;
        });
      })
    }
    function reloadProvinces(){
      if(!_.isEmpty($rootScope.provinces)){
        return;
      }
      return Addresses.getProvinces().then(function(provinces){
        $rootScope.provinces = provinces;
        Base.setLocal('provinces', provinces);
      }, function(e){
        Base.getLocal('provinces').then(function(provinces){
          $rootScope.provinces = provinces;
        });
      });
    }
    function reloadCart(accessToken){
      return Carts.getCartItems(accessToken).then(function(result){
        var cartItems = _.map(result.carts, function(cartItem){cartItem.checked = true; return cartItem;});
        var brandIds = _.unique(_.map(cartItems, function(cartItem){return cartItem.Cart.brand_id}));
        $rootScope.user.cartBrands = _.map(brandIds, function(brandId){
          var brand = _.find($rootScope.brands, function(brand){return brand.Brand.id == brandId});
          if(_.isEmpty(brand)){
            brand = _.find(result.brands, function(brand){return brand.Brand.id == brandId});
          }
          brand.cartItems = _.filter(cartItems, function(ci){return ci.Cart.brand_id == brandId});
          return brand;
        });
        Base.setLocal('user.cartBrands', $rootScope.user.cartBrands);
      }, function(e){
        Base.getLocal('user.cartBrands').then(function(cartBrands){
          $rootScope.user.cartBrands = cartBrands;
        });
      });
    }
    function getCartInfo(pidList, couponCode, accessToken){
      return Carts.getCartInfo(pidList, couponCode, $rootScope.user.token.access_token).then(function(result){
        $rootScope.user.cartInfo = result;
      });
    }
    function reloadAddresses(accessToken){
      return Addresses.list(accessToken).then(function(addresses){
        $rootScope.user.addresses = addresses;
        Base.setLocal('user.addresses', addresses);
        $rootScope.$broadcast('addressChanged', addresses);
      }, function(e){
        Base.getLocal('user.addresses').then(function(addresses){
          $rootScope.user.addresses = addresses;
        });
      });
    }
    function reloadOrders(accessToken){
      return Orders.list(accessToken).then(function(data){
        $rootScope.user.orders = data.orders;
        $rootScope.user.order_carts = data.order_carts;
        $rootScope.user.ship_type = data.ship_type;
        $rootScope.$broadcast('orderStateChanged', $rootScope.user.orders);
        Base.setLocal('user.orders', $rootScope.user.orders);
        Base.setLocal('user.order_carts', $rootScope.user.order_carts);
        Base.setLocal('user.ship_type', $rootScope.user.ship_type);
      }, function(e){
        Base.getLocal('user.orders').then(function(orders){
          $rootScope.user.orders = orders;
        });
        Base.getLocal('user.order_carts').then(function(order_carts){
          $rootScope.user.order_carts = order_carts;
        });
        Base.getLocal('user.ship_type').then(function(ship_type){
          $rootScope.user.ship_type = ship_type;
        });
      });
    }
    function getDefaultAddress(){
      var defaultAddress =  _.find($rootScope.user.addresses, function(address){return address.OrderConsignees.status == 1});
      if(_.isEmpty(defaultAddress) && $rootScope.user.addresses.length > 0){
        defaultAddress = $rootScope.user.addresses[0];
      }
      return defaultAddress || {};
    }
    function updateOrderState(orderId, state){
      var order = _.find($rootScope.user.orders, function(order){return order.Order.id == orderId});
      if(_.isEmpty(order)){
        return;
      }
      order.Order.status = state;
      $rootScope.$broadcast('orderStateChanged', order);
    }
    function alertMessage(message){
      $rootScope.alert = $rootScope.alert || {message: ''};
      $rootScope.alert.message = message;
      $timeout(function(){
        $rootScope.alert.message = "";
      }, config.timeout);
    }
    function showAlertMessage(){
      return !_.isEmpty($rootScope.alert) && !_.isEmpty($rootScope.alert.message);
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
    function toStoreHomePage(brand){
      return $state.go('store.home', {id: brand.Brand.id, name: brand.Brand.name});
    }
  }
})(window, window.angular, window.cordova);

