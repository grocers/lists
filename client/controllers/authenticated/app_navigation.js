Template.appNavigation.helpers({
  username: function () {
    var user = Meteor.user();
    if (!user) {
      return '';
    } else {
      return user.profile.fullName;
    }
  },
  sendingFeedback: function () {
    return Session.get('sendingFeedback');
  },
  isCustomer: function () {
    var user = Meteor.user();
    if (!user) {
      return false;
    } else {
      return !user.profile.isAdmin;
    }
  }
});

Template.appNavigation.events({
  "submit .feedback-form": function (event) {
    event.preventDefault();

    var inquiry = $('.help #message').val();
    if (!inquiry) {
      return sAlert.warning("Please enter a message to send.");
    }

    var message = {
      user: Meteor.userId(),
      text: inquiry
    };

    Session.set('sendingFeedback', true);
    Meteor.call('createMessage', message, function (error) {
      Session.set('sendingFeedback', false);
      if (error) {
        console.log('Error:', error);
        return sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
      } else {
        $(event.target).trigger('reset');
        sAlert.success('Your message was sent successfully.');
      }
    });
  }
});
