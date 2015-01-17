(function (window, angular) {
  "use strict";
  angular.module('module.services')
  .service('Profile', Profile)

  function Profile($q,$log,Base,software,Users){
    var self = this;
    self.PROFILE_STATUS = [
      {state: 'image', desc: '头像'}, 
      {state: 'nickname', desc: '昵称'}, 
      {state: 'sex', desc: '性别'},
      {state: 'email', desc: '邮箱'}, 
      {state: 'mobilephone', desc: '手机'}
    ];

    return {
      edit: edit, 
      getProfileStatus: getProfileStatus
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
      $log.log(json);
      Base.post('/api_orders/edit_my_profile.json?access_token='+Users.getTokenLocally().access_token,json).then(function(result){
        $log.log(result);
        Users.refreshToken();
      })
    }

    function getProfileStatus(state){
      return _.find(self.PROFILE_STATUS, function(profileStatus){return profileStatus.state == state}) || {};
    }
  }
})(window, window.angular);