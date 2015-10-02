Accounts.onLogin(function () {
  var user = Meteor.user();
  var redirectTo = Session.get('redirectAfterLogin');

  if (redirectTo) {
    if (redirectTo !== 'login') {
      Session.set('redirectAfterLogin', null);
      return FlowRouter.go(redirectTo);
    }
  } else {
    var currentPath = window.location.pathname;
    if (currentPath === '/login') {
      if (user.profile.isAdmin) {
        FlowRouter.go('adminOverview');
      } else {
        FlowRouter.go('lists');
      }
    } else {
      FlowRouter.go(currentPath);
    }
  }
});
