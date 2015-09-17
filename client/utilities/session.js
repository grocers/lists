Accounts.onLogin(function () {
  console.log('runningOnlogin', redirectTo);
  var redirectTo = Session.get('redirectAfterLogin');
  if (redirectTo) {
    if (redirectTo !== 'login') {
      return FlowRouter.go(redirectTo);
    }
  } else {
    var user = Meteor.user();
    if (user.profile.isAdmin) {
      redirectTo = 'adminOverview';
    } else {
      redirectTo = 'lists';
    }
    return FlowRouter.go(redirectTo);
  }
});
