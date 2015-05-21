// Ionic Starter App

(function(window, angular, cordova, navigator){
  angular.module('ilegong', ['ionic', 'ilegong.home', 'module.my', 'module.stores', 'ilegong.templates','module.products', 'module.orders', 'module.cart', 'module.others', 'module.services', 'module.directives'])
  .config(configStates)
  .config(configApp)
  .config(extendLog)
  .config(extendExceptionHandler)
  .config(configCompileProvider)
  .config(configLocalForage)
  .config(configHttpProvider)
  .run(initApp)

  function initApp($ionicPlatform, $log, $timeout, Users) {
    $ionicPlatform.ready(function() {
      $timeout(function(){
        if(cordova && cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      }, 1000);
    });
  };

  function configStates($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {url: "/app", templateUrl: "tabs.html", controller: AppCtrl, abstract: true})
      .state('app.home', {url: '/home', views: {'app-home': {templateUrl: 'home.main.html',controller: 'HomeMainCtrl as vm'}}})
      .state('app.home-category', {url: '/categories/:tagId',views: {'app-home': {templateUrl: 'home-category.html',controller: 'HomeCategoryCtrl as vm'}}})
   
      .state('app.stores', {url: '/stores', views: {'app-stores': {templateUrl: 'stores.main.html', controller: 'StoreMainCtrl as vm'}}})

      .state('app.cart', {url: '/cart', views: {'app-cart': {templateUrl: 'cart-main.html',controller: 'CartMainCtrl as vm'}}})

      .state('app.orders',{url:'/orders/:state',views:{'app-orders':{templateUrl:'orders.html',controller:'OrdersCtrl as vm'}}})

      .state('app.my', {url: '/my', views: {'app-my': {templateUrl: 'my.main.html',controller: 'MyMainCtrl as vm'}}})
      .state('app.my-profile',{url:'/my-profile',views:{'app-my':{templateUrl:'my-profile.html',controller:'MyProfileCtrl as vm'}}})
      .state('app.my-profile-mobilephone',{url:'/my-profile-mobilephone',views:{'app-my':{templateUrl:'my-profile-mobilephone.html',controller:'MyProfileMobilePhoneCtrl as vm'}}})
      .state('app.my-profile-email',{url:'/my-profile-email',views:{'app-my':{templateUrl:'my-profile-email.html',controller:'MyProfileEmailCtrl as vm'}}})
      .state('app.my-profile-sex',{url:'/my-profile-sex',views:{'app-my':{templateUrl:'my-profile-sex.html',controller:'MyProfileSexCtrl as vm'}}})
      .state('app.my-profile-nickname',{url:'/my-profile-nickname',views:{'app-my':{templateUrl:'my-profile-nickname.html',controller:'MyProfileNickNameCtrl as vm'}}})
      .state('app.my-coupons',{url:'/my-coupons',views:{'app-my':{templateUrl:'my-coupons.html',controller:'MyCouponsCtrl as vm'}}})
      .state('app.my-offers',{url:'/my-offers',views:{'app-my':{templateUrl:'my-offers.html',controller:'MyOffersCtrl as vm'}}})

      .state('product-detail', {url: '/products/:id/:from', templateUrl: 'product-detail.html', controller: 'ProductDetailCtrl as vm'})
      .state('product-detail-content', {url:'/products/:id/:from/content', templateUrl: 'product-detail-content.html', controller:'ProductDetailContentCtrl as vm'})
      .state('product-detail-comments', {url:'/products/:id/:from/comments/:type', templateUrl: 'product-detail-comments.html', controller:'ProductDetailCommentsCtrl as vm'})
      .state('tuan-buying-detail', {url: '/tuanBuyings/:id/:from', templateUrl: 'tuan-buying-detail.html', controller: 'TuanBuyingDetailCtrl as vm'})

      .state('account-login', {url: '/account-login', templateUrl: 'my-account-login.html',controller: 'MyAccountLoginCtrl as vm'})
      .state('account-register', {url: '/account-register', templateUrl: 'my-account-register.html',controller: 'MyAccountRegisterCtrl as vm'})

      .state('addresses', {url:'/addresses/:state', templateUrl:'my-addresses.html',controller:'MyAddressesCtrl as vm'})
      .state('address-edit', {url:'/address-edit/:editId', templateUrl:'my-address-edit.html',controller:'MyAddressEditCtrl as vm'})
      .state('pickups', {url:'/pickups', templateUrl:'pickups.html',controller:'PickupsCtrl as vm'})

      .state('orders', {url:'/orders/:state', templateUrl:'orders.html', controller:'OrdersCtrl as vm'})
      .state('order-detail', {url:'/order/:id', templateUrl:'order-detail.html', controller:'OrderDetailCtrl as vm'})

      .state('cart-confirmation', {url:'/cart-confirmation/:type', templateUrl:'cart-confirmation.html', controller:'CartConfirmationCtrl as vm'})

      .state('store', {url: '/stores/:id/:name', templateUrl: 'store-tabs.html', controller: 'StoreCtrl as app', abstract: true})
      .state('store.home', {url: '/home', views: {'store-home': {templateUrl: 'store.home.html', controller: 'StoreHomeCtrl as vm'}}})
      .state('store.intro', {url: '/intro', views: {'store-intro': {templateUrl: 'store.intro.html', controller: 'StoreIntroCtrl as vm'}}})

      .state('my-ilegong', {url: '/my/ilegong', templateUrl: 'my-ilegong.html',controller: 'MyIlegongCtrl as vm'})
      .state('my-messages', {url: '/my/messages', templateUrl: 'my-messages.html',controller: 'MyMessagesCtrl as vm'})
      .state('my-message', {url: '/my/messages/:id', templateUrl: 'my-message.html',controller: 'MyMessageCtrl as vm'})

    $urlRouterProvider.otherwise('/app/categories');
  }

  /* @ngInject */
  function extendLog($provide){
    $provide.decorator('$log', function($delegate, $injector){
      var _log = $delegate.log;
      var _warn = $delegate.warn;
      var _info = $delegate.info;
      var _debug = $delegate.debug;
      var _error = $delegate.error;
      var addMessage = function(message, forceLog){
        var $rootScope = $injector.get("$rootScope");
        $rootScope.config = $rootScope.config || {logMode: false};
        if($rootScope.config.logMode || forceLog){
          $rootScope.messages = $rootScope.messages || [];
          $rootScope.messages.push(message);
        }
        return message;
      }

      $delegate.log = function(msg, forceLog){_log(addMessage(msg, forceLog || false)); return this;};
      $delegate.warn = function(msg, forceLog){_warn(addMessage(msg, forceLog || false)); return this;};
      $delegate.info = function(msg, forceLog){_info(addMessage(msg, forceLog || false)); return this;};
      $delegate.debug = function(msg, forceLog){_debug(addMessage(msg, forceLog || false)); return this;};
      $delegate.error = function(msg, forceLog){_error(addMessage(msg, forceLog || false)); return this;};

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
          $log.error(exception, true).error(cause, true);
        }
        $delegate(exception, cause);
      };
    });
  }

  /* @ngInject */
  function configCompileProvider($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https|file|blob|cdvfile|http|chrome-extension|blob:chrome-extension):|data:image\//);
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
    $ionicConfigProvider.backButton.text('返回').previousTitleText(false).icon('ion-ios-arrow-left');
  }

  function AppCtrl($q,$scope,$rootScope, $timeout, $ionicPopup, $log, $state, $sce, config, Base, Orders, Carts, Users, Addresses, Profile, Stores, Coupons) {
    var app = $scope;
    app.toHomePage = toHomePage;
    app.toStoresPage = toStoresPage;
    app.toCartPage = toCartPage;
    app.toMyPage = toMyPage;
    app.toOrdersPage = toOrdersPage;

    $rootScope.refreshData = refreshData;
    $rootScope.onUserLoggedIn = onUserLoggedIn;
    $rootScope.onUserLoggedOut = onUserLoggedOut;
    $rootScope.reloadProfile = reloadProfile;
    $rootScope.reloadProvinces = reloadProvinces;
    $rootScope.reloadStores = reloadStores;
    $rootScope.reloadCart = reloadCart;
    $rootScope.reloadCoupons = reloadCoupons;
    $rootScope.reloadOrders = reloadOrders;
    $rootScope.reloadAddresses = reloadAddresses;
    $rootScope.confirmCart = confirmCart;
    $rootScope.getDefaultAddress = getDefaultAddress;
    $rootScope.updateOrderState = updateOrderState;
    $rootScope.removeOrder = removeOrder;
    $rootScope.alertMessage = alertMessage;
    $rootScope.showAlertMessage = showAlertMessage;
    $rootScope.toStoreHomePage = toStoreHomePage;
    $rootScope.countOfCheckedCartItems = countOfCheckedCartItems;
    $rootScope.countOfCartItems = countOfCartItems;

    activate();

    function activate(){
      $rootScope.config = config;
      $rootScope._ = window._;
      $rootScope.hideTabs = [];
      $rootScope.user = $rootScope.user || {token:{}, loggedIn: false, profile:{}, cartItems: [], cartBrands: [], addresses: [], orders: [], order_carts: [], ship_type: {}, validCoupons: [], invalidCoupons: []};
      $rootScope.brands = [];
      $rootScope.provinces = [];
      $rootScope.alert = {message: ''};

      // see: http://stackoverflow.com/questions/5180918/phonegap-on-android-window-device-is-undefined
      $timeout(function(){
        if(cordova && cordova.getAppVersion){
          cordova.getAppVersion().then(function (version) {
            $rootScope.config.app.version = version;
          }, function(e){
            $log.log('get version number failed: ', true).log(e, true);
          });
        }
      }, 1000);
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
      $rootScope.reloadCoupons(token.access_token);
    }
    function onUserLoggedOut(){
      $rootScope.user = {token:{}, loggedIn: false, profile:{}, cartItems: [], cartBrands:[], addresses: [], orders: [], order_carts: [], ship_type: {}, validCoupons: [], invalidCoupons: []};
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
      return Stores.list().then(function(data){
        $rootScope.brands = data.brands;
        Base.setLocal('brands', data.brands);
      }, function(e){
        Base.getLocal('brands').then(function(brands){
          $rootScope.brands = brands;
        });
        return e;
      });
    }
    function reloadProvinces(){
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
        var cartItems = result.carts;
        var brandIds = _.filter(_.unique(_.map(cartItems, function(cartItem){return cartItem.Cart.brand_id})), function(brandId){return !_.isNull(brandId)});
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
        return e;
      });
    }
    function confirmCart(pidList, couponCode, accessToken){
      return Carts.confirmCart(pidList, couponCode, $rootScope.user.token.access_token).then(function(result){
        $rootScope.user.cartInfo = result;

        var brandItem = _.find($rootScope.user.cartInfo.cart.brandItems, function(bi){return true});
        var item = _.find(brandItem.items, function(i){return true});
        if(!_.isEmpty(item.specialPromotions)){
          $rootScope.user.cartInfo.shippment = new Shippment(item.specialPromotions.limit_ship, item.specialPromotions.items);
        }
        else{
          $rootScope.user.cartInfo.shippment = new Shippment(false, []);
        }

        return result;
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
        $rootScope.user.order_carts = data.order_carts;
        $rootScope.user.orders = data.orders;
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
    function reloadCoupons(accessToken){
      return Coupons.getCoupons(accessToken).then(function(data){
        _.each(data.coupons, function(coupon){
          coupon.Coupon.valid_begin = new Date(coupon.Coupon.valid_begin);
          coupon.Coupon.valid_end = new Date(coupon.Coupon.valid_end);
        });

        var currentDate = new Date();
        $rootScope.user.validCoupons = _.filter(data.coupons, function(coupon){return coupon.Coupon.status == 1 && coupon.Coupon.valid_end >= currentDate});
        $rootScope.user.invalidCoupons = _.filter(data.coupons, function(coupon){return coupon.Coupon.status != 1 || coupon.Coupon.valid_end < currentDate});
        Base.setLocal('user.validCoupons', $rootScope.user.validCoupons);
        Base.setLocal('user.invalidCoupons', $rootScope.user.invalidCoupons);
      }, function(e){
        Base.getLocal('user.validCoupons').then(function(validCoupons){
          $rootScope.user.validCoupons = validCoupons;
        });
        Base.getLocal('user.invalidCoupons').then(function(invalidCoupons){
          $rootScope.user.invalidCoupons = invalidCoupons;
        });
      });
    }
    function getDefaultAddress(){
      var defaultAddress =  _.find($rootScope.user.addresses, function(address){return address.OrderConsignees.status == 1});
      if(_.isEmpty(defaultAddress) && !_.isEmpty($rootScope.user.addresses) && $rootScope.user.addresses.length > 0){
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
    function removeOrder(orderId){
      $rootScope.user.orders = _.reject($rootScope.user.orders, function(order){return order.Order.id == orderId});
      $rootScope.$broadcast('orderStateChanged', order);
    }
    function alertMessage(message){
      if(!_.isEmpty($rootScope.alert.timer)){
        $timeout.cancel($rootScope.alert.timer);
      }
      $rootScope.alert.message = message;
      $rootScope.alert.timer = $timeout(function(){
        $rootScope.alert.timer = null;
        $rootScope.alert.message = "";
      }, config.timeout);
    }
    function showAlertMessage(){
      return !_.isEmpty($rootScope.alert) && !_.isEmpty($rootScope.alert.message);
    }
    function toHomePage(){
      $rootScope.hideTabs = [];
      $state.go('app.home-category', {tagId: 23});
    }
    function toStoresPage(){
      $rootScope.hideTabs = [];
      $state.go('app.stores');
    }
    function toCartPage(){
      $rootScope.hideTabs = [];
      $state.go('app.cart');
    }
    function toMyPage(){
      $rootScope.hideTabs = [];
      $state.go('app.my');
    }
    function toOrdersPage(){
      $rootScope.hideTabs = [];
      $state.go('app.orders', {state:-2});
    }
    function toStoreHomePage(brand){
      return $state.go('store.home', {id: brand.Brand.id, name: brand.Brand.name});
    }
    function countOfCheckedCartItems(){
      return _.reduce($rootScope.user.cartBrands, function(memo, brand){
        return memo + _.filter(brand.cartItems, function(ci){return ci.checked}).length;
      }, 0);
    }
    function countOfCartItems(){
      return _.reduce($rootScope.user.cartBrands, function(memo, brand){
        return memo + brand.cartItems.length;
      }, 0);
    }
  }
})(window, window.angular, window.cordova, window.navigator);

