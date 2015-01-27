(function (window, angular) {
  "use strict";
  angular.module('module.services')
  .service('Profile', Profile)

  function Profile($q,$log,Base,config,Users){
    var self = this;
    self.PROFILE_STATUS = [
      {state: 'image', desc: '头像'}, 
      {state: 'nickname', desc: '昵称'}, 
      {state: 'sex', desc: '性别'},
      {state: 'email', desc: '邮箱'}, 
      {state: 'mobilephone', desc: '手机'}
    ];

    return {
      editProfile: editProfile, 
      getProfileStatus: getProfileStatus
    }
    function editProfile(profile){
      return Base.post('/api_orders/edit_my_profile.json?access_token='+Users.getTokenLocally().access_token, profile);
    }

    function getProfileStatus(state){
      return _.find(self.PROFILE_STATUS, function(profileStatus){return profileStatus.state == state}) || {};
    }
  }
})(window, window.angular);