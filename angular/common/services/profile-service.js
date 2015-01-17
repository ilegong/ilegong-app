(function (window, angular) {
  "use strict";
  angular.module('module.services')
  .service('Profile', Profile)

  function Profile($q,$log,Base,software,Users){
    var self = this;
    return {
      edit:edit
    }
    function edit(nickname,image,sex,bio,companies){
      var json = {};
      if(nickname != null){
        json['nickname'] = nickname; 
      }
      if(image != null){
        json['image'] = image;
      }
      if(sex != null){
        json['sex'] = sex;
      }
      if(bio != null){
        json['bio'] = bio;
      }
      if(companies != null){
        json['companies'] = companies;
      }
      for(var i=0;i<30;i++){
            $log.log('editProfile');
          }
      $log.log(json);
      Base.post('/api_orders/edit_my_profile.json?access_token='+Users.getTokenLocally().access_token,json).then(function(result){
        $log.log(result);
        Users.refreshToken();
      })
    }
  }
})(window, window.angular);