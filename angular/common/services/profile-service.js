(function (window, angular) {
  "use strict";
  angular.module('module.services')
  .service('Profile', Profile)

  function Profile($q,$log,Base,config,Users){
    var self = this;

    return {
      editProfile: editProfile 
    }
    function editProfile(profile){
      return Base.post('/api_orders/edit_my_profile.json?access_token='+Users.getTokenLocally().access_token, profile);
    }
  }
})(window, window.angular);