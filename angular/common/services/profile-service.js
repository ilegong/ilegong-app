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
    function getProfile(){
      return Base.get('/api_orders/my_profile.json?access_token=' + $rootScope.user.token.access_token).then(function(profile){return profile.my_profile});
    }
    function editProfile(profile){
      return Base.post('/api_orders/edit_my_profile.json?access_token=' + Users.getTokenLocally().access_token, profile);
    }
  }
})(window, window.angular);