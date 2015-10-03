Accounts.onLogin(function () {
  var user = Meteor.user();
  var redirectTo = Session.get('redirectAfterLogin');

  var currentRoute = FlowRouter.current().route;

  if (redirectTo) {
    if (redirectTo !== 'login') {
      Session.set('redirectAfterLogin', null);
      return FlowRouter.go(redirectTo);
    }
  } else {
    if (Route.isPublicRoute(currentRoute)) {
      if (user.profile.isAdmin) {
        FlowRouter.go('adminOverview');
      } else {
        FlowRouter.go('lists');
      }
    } else {
      var currentPath = window.location.pathname;
      FlowRouter.go(currentPath);
    }
  }
});
