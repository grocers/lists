Template.forgotPassword.onCreated(function () {
});

Template.forgotPassword.helpers({
  isResettingPassword: function () {
    return Session.get('resettingPassword');
  },
  linkSent: function () {
    return Session.get('linkSent');
  }
});

Template.forgotPassword.events({
  "submit .form": function (event) {
    event.preventDefault(); 
    Session.set('linkSent', false);
    var email = $('#email').val();
    if (!email) {
      return sAlert.warning('Please enter your email address');
    }

    Meteor.call('hasAssociatedAccount', email, function (error, hasAssociatedAccount) {
      if (error) {
        console.log('Error:', error);
        return sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
      } 

      if (hasAssociatedAccount) {
        // Send reset link
        Session.set('resettingPassword', true);
        Meteor.call('sendPasswordResetLink', email, function (error, resetToken) {
          Session.set('resettingPassword', false);
          if (error) {
            console.log('Error:', error);
            return sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          } 
          
          // $('#email').val('');
          Session.set('linkSent', true);
        });
      } else {
        return sAlert.error('We couldn\'t find an account associated with that email address');
      }
    });
  }
});
