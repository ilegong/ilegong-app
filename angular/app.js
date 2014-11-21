// Ionic Starter App

(function(){
angular.module('ilegong', ['ionic', 'ilegong.home', 'ilegong.my', 'ilegong.tryings', 'ilegong.sharings', 'ilegong.categories', 'ilegong.templates'])
.run(initApp)
.config(configStates);

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
    .state('tab', state("/tab", "tabs.html", null, {abstract: true}))
    .state('tab.home', {url: '/home', views: {'tab-home': {templateUrl: 'home.main.html',controller: 'HomeCtrl'}}})
    .state('tab.categories', {url: '/categories',views: {'tab-categories': {templateUrl: 'categories.main.html',controller: 'CategoriesCtrl'}}})
    .state('tab.category-detail', {url: '/categories/:id',views: {'tab-categories': {templateUrl: 'category-detail.html',controller: 'CategoryDetailCtrl'}}})
    .state('tab.sharings', {url: '/sharings', views: {'tab-sharings': {templateUrl: 'sharings.main.html',controller: 'SharingsCtrl'}}})
    .state('tab.tryings', {url: '/tryings',views: {'tab-tryings': {templateUrl: 'tryings.main.html',controller: 'TryingsCtrl'}}})
    .state('tab.my', {url: '/my', views: {'tab-my': {templateUrl: 'my.main.html',controller: 'MyCtrl'}}});
  $urlRouterProvider.otherwise('/tab/home');
  }

  function state(url, templateUrl, controller, options){
    return _.extend({url: url, templateUrl: templateUrl, controller: controller}, options || {});
  }
  function subState(url, templateUrl, controller, options){
    var menuContent = {templateUrl: templateUrl, controller: controller || function(){}}
    return _.extend({url: url, views: {'menuContent' : menuContent}}, options || {})
  };
})();

