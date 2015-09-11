Accounts.onLogin(function () {
  var redirectTo = Session.get('redirectAfterLogin');
  if (redirectTo && redirectTo !== 'login') {
    return FlowRouter.go(redirectTo);
  }
});
