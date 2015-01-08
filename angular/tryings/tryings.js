(function (window, angular) {
  "use strict";

  angular.module('ilegong.tryings', [])
  .controller('TryingsCtrl', TryingsCtrl)
  .controller('TryingDetailCtrl', TryingDetailCtrl)

  /* @ngInject */
  function TryingsCtrl($rootScope, $scope, Tryings){
    var vm = this;
    activate();

    function activate(){
      Tryings.list().then(function(data){
        vm.tryings = data.cates;
      })
    }
  }
  /* @ngInject */
  function TryingDetailCtrl($rootScope, $scope){
    $scope.trying = new Trying(1, '三期试吃团播报', '第三期试吃团成立了！团员们隆重登场~', '/articles/view/389.html', 'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9aa6c4bcce1_1110.jpg')
  }


})(window, window.angular);