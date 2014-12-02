(function (window, angular) {
  "use strict";

  angular
  .module('ilegong.home', ['app.services'])
  .controller('HomeCtrl', HomeCtrl)
  
  /* @ngInject */
  function HomeCtrl($rootScope, $scope, $http, Products){
    $rootScope.hideTabs = false;
    var vm = this;
    active();

    $scope.SlideBoxItems = [
                            new SlideBoxItem('http://51daifan.sinaapp.com/img/banner/pyshuo_banner_fengli.jpg','http://www.tongshijia.com/products/20140809/tai_wan_tu_feng_li_su.html'),
                            new SlideBoxItem('http://51daifan.sinaapp.com/img/banner/pyshuo_banner_follower.jpg','http://www.tongshijia.com/products/20140903/qing_hai_hu_hua_fen.html'),
                            new SlideBoxItem('http://51daifan.sinaapp.com/img/banner/pyshuo_banner_follower.jpg','http://www.tongshijia.com/products/20140903/qing_hai_hu_hua_fen.html')
                            ];


    $scope.ProductL1 = [
    	new Product(1,'搜狐潘婷家的喀什灰枣君',40.00,0,'搜狐-潘婷','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201410/thumb_m/0e712bebad0_1004.jpg','http://www.tongshijia.com/products/20141117/xin_jiang_hui_zao.html',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
    	new Product(2,'西域美农椒盐碧根果250g',25.99,64.50,'西域美侬-李春望','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/873270830e5_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201409/thumb_m/56653661417_0908.jpg','http://www.tongshijia.com/products/20141118/xi_yu_mei_nong_jiao_yan_bi_gen_guo_250g.html',true,'http://www.tongshijia.com/brands/20140908/xi_yu_mei_nong_li_chun_wang.html')
    ]
    $scope.TypeAndProducts = [
	    new TypeAndProducts(
	    	new Type('枣、干果','http://www.tongshijia.com/categories/tag/xiaochilingshi.html'),
	    	[
	    		new Product(1,'枣、干果1',13,0,'商家1','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/9cd2a96c9c7_1118.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9aa6c4bcce1_1110.jpg','http://www.baidu.com',true,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
				new Product(2,'枣、干果2',24,30,'商家2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/06c7c8c5851_1119.jpg','http://www.baidu.com',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html')
			]),
		new TypeAndProducts(
			new Type('新鲜水果','http://www.tongshijia.com/categories/tag/shuiguoganguo.html'),
			[
				new Product(1,'新鲜水果1',13,0,'商家1','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/9cd2a96c9c7_1118.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9aa6c4bcce1_1110.jpg','http://www.baidu.com',true,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
				new Product(2,'新鲜水果2',24,30,'商家2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/06c7c8c5851_1119.jpg','http://www.baidu.com',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
				new Product(3,'枣、干果2',24,30,'商家2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/06c7c8c5851_1119.jpg','http://www.baidu.com',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html')
			])
	]



  $scope.items = [new ProductItem(new ProductCat('枣、干果','','http://www.tongshijia.com/img/class/classn5.png',"http://baidu.com"),
                    [
                      new ProductSubItem('椒盐碧根果250g','color:#9ab300;','西域美农-李春望','','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/b7fdeee1f2f_1118.jpg','http://baidu.com'),
                      new ProductSubItem('沧州新产金丝小枣','color:#a00f12;','检验员-宋德香','','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg','http://baidu.com')]),
                  new ProductItem(new ProductCat('新鲜水果','','http://www.tongshijia.com/img/class/classn3.png',"http://baidu.com"),
                    [
                      new ProductSubItem('河南河阴软籽石榴','color:#b07406;','郑州民政局-段赵明','','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg','http://baidu.com'),
                      new ProductSubItem('山东精品红富士','color:#772617;','材料学博士-刘丙学','','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9036455c197_1125.jpg','http://baidu.com')]),
                  new ProductItem(new ProductCat('蛋糕甜点','','http://www.tongshijia.com/img/class/classn8.png',"http://baidu.com"),
                    [
                      new ProductSubItem('开心果牛轧糖','color:#ae950e;','营养师-王扬','','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/0684c2cc96b_1107.jpg','http://baidu.com'),
                      new ProductSubItem('印尼古法千层蛋糕','color:#e74e01;','材料学博士-刘丙学','','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/371c77a62be_1120.jpg','http://baidu.com')])]
    
    function active(){
      Products.list().then(function(data){
        vm.slideBoxItems = [];
        vm.brands = data.brands;
        vm.tagsWithProducts = data.tagsWithProducts;
      });
    }
  }
})(window, window.angular);