// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ilegong', ['ionic', 'ilegong.home', 'ilegong.my', 'ilegong.tryings', 'ilegong.sharings', 'ilegong.categories', 'ilegong.templates'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'home.main.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('tab.categories', {
      url: '/categories',
      views: {
        'tab-categories': {
          templateUrl: 'categories.main.html',
          controller: 'CategoriesCtrl'
        }
      }
    })

    .state('tab.sharings', {
      url: '/sharings',
      views: {
        'tab-sharings': {
          templateUrl: 'sharings.main.html',
          controller: 'SharingsCtrl'
        }
      }
    })

    .state('tab.tryings', {
      url: '/tryings',
      views: {
        'tab-tryings': {
          templateUrl: 'tryings.main.html',
          controller: 'TryingsCtrl'
        }
      }
    })

    .state('tab.my', {
      url: '/my',
      views: {
        'tab-my': {
          templateUrl: 'my.main.html',
          controller: 'MyCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

