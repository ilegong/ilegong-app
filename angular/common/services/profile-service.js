(function (window, angular) {
  "use strict";
  angular.module('module.services')
  .service('Profile', Profile)

  function Profile($q,$log, $rootScope, Base,config,Users){
    var self = this;

    return {
      editProfile: editProfile, 
      getProfile: getProfile
    }
    function getProfile(accessToken){
      return Base.get('/api_orders/my_profile.json?access_token=' + accessToken).then(function(profile){return profile.my_profile});
    }
    function editProfile(profile, accessToken){
      return Base.post('/api_orders/edit_my_profile.json?access_token=' + accessToken, profile);
    }
  }
})(window, window.angular);