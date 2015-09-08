Accounts.onLogin(function () {
  console.log('logged in successfuly...');
  var redirectTo = Session.get('redirectAfterLogin');
  if (redirectTo && redirectTo !== 'login') {
    return FlowRouter.go(redirectTo);
  } else {
    return FlowRouter.go('lists');
  }
});
