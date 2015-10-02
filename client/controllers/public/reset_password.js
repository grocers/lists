Template.resetPassword.onCreated(function () {
  var self = this;

  self.autorun(function () {
    var resetToken = FlowRouter.getParam('token');
    self.subscribe('userByResetToken', resetToken, {
      onError: function (error) {
        console.log('Error:', error);
        Session.set('linkIsValid', false);
        sAlert.error(error.reason || 'We could not process your last request.');
      },
      onReady: function () {
        Session.set('linkIsValid', true);
      }
    });
  });
});

// Shared code
var getUser = function () {
  return Meteor.users.findOne({"resetToken.hash": FlowRouter.getParam('token')});
};

Template.resetPassword.helpers({
  linkIsValid: function () {
    return Session.get('linkIsValid');
  },
  email: function () {
    return getUser().emails[0].address;
  },
  passwordChanged: function () {
    return Session.get('passwordChanged');
  },
  isChangingPassword: function () {
    return Session.get('isChangingPassword');
  }
});

Template.resetPassword.events({
  "submit .form": function (event) {
    event.preventDefault();

    var password = $('#new-password').val(),
        confirm = $('#confirm-password').val();

    if (!password) {
      return sAlert.warning('Both password fields are required');
    }
    if (password === confirm) {
      var user = getUser();

      Session.set('isChangingPassword', true);
      Meteor.call('setNewPassword', {id: user._id, newPassword: password}, function (error) {
        Session.set('isChangingPassword', false);
        if (error) {
          console.log('Error:', error);
          return sAlert.error(error.reason || 'We could not process your last request.');
        }

        Session.set('passwordChanged', true);
        return sAlert.success('Password changed.');
      });
    } else {
      return sAlert.error('Your passwords don\'t match. Please check and try again.');
    }
  }
});
