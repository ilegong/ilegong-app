(function (window, angular) {
  "use strict";

  angular.module('module.tryings')
  .controller('TryingDetailCtrl', TryingDetailCtrl)

  /* @ngInject */
  function TryingDetailCtrl($rootScope, $scope, $stateParams, $ionicNavBarDelegate, Tryings){
    var vm = this;
    activate();

    function activate(){
      vm.articleId = $stateParams.id;
      Tryings.getArticle(vm.articleId).then(function(article){
        vm.article = article.Article;
      });
    }
  }
})(window, window.angular);