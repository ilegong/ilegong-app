(function (window, angular) {
  "use strict";

  angular.module('module.tryings')
  .controller('TryingDetailCtrl', TryingDetailCtrl)

  /* @ngInject */
  function TryingDetailCtrl($rootScope, $scope, $stateParams, Tryings){
    var vm = this;
    activate();

    function activate(){
      vm.articleId = $stateParams.id;
      vm.article = ""
      Tryings.getArticle(vm.articleId).then(function(result){
        vm.article = result;
      });
    }
  }
})(window, window.angular);