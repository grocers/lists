Template.appNavigation.helpers({
  username: function () {
    return Meteor.user().profile.fullName;
  }
});
