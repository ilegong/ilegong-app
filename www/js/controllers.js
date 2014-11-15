angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('CategoriesCtrl', function($scope) {
})

.controller('SharingsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('TryingsCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('MyCtrl', function($scope) {
});
