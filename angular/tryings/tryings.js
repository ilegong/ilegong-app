(function (window, angular) {
  "use strict";

  angular.module('ilegong.tryings', [])
  .controller('TryingsCtrl', TryingsCtrl)
  .controller('TryingDetailCtrl', TryingDetailCtrl)

  /* @ngInject */
  function TryingsCtrl($scope){
    $scope.tryings = [
      new Trying(1, '三期试吃团播报', '第三期试吃团成立了！团员们隆重登场~', '/articles/view/389.html', 'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9aa6c4bcce1_1110.jpg'),
      new Trying(2, '三期试吃团产品点评', '[正宗迁徙板栗]、[原生态成熟椴树蜂蜜]、[河南焦作山药]、[坡坡上竹编礼篮装]、[五常稻花香大米]、[你好吃货的零食]接受三期试吃团组织的检验，看看大家都怎么品评这些商品的哦~', '/articles/view/391.html', 'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/06c7c8c5851_1119.jpg')
    ]
  }
  /* @ngInject */
  function TryingDetailCtrl($scope){
    $scope.trying = new Trying(1, '三期试吃团播报', '第三期试吃团成立了！团员们隆重登场~', '/articles/view/389.html', 'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9aa6c4bcce1_1110.jpg')
  }


})(window, window.angular);