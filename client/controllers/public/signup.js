Template.signup.helpers({
  isLoggingIn: function () {
    return Session.get('isLoggingIn');
  }
});

Template.signup.events({
  "submit .form": function (event) {
    event.preventDefault();

    function resetForm() {
      $(event.target).trigger('reset');
    }

    var fullName    =     $('#full-name').val(),
      email       =     $('#email').val(),
      telephone   =     $('#telephone').val(),
      password    =     $('#password').val();

    if (!(fullName && email && telephone && password)) {
      sAlert.warning("All fields are required. Please check your inputs.");
      return;
    } else {
      // Display spinner & disable text fields
      Session.set('isLoggingIn', true);

      // Create the user's account.
      var user = {
        email: email,
        password: password,
        profile: {
          fullName: fullName,
          telephone: telephone,
          userType: 'customer',
          isAdmin: false
        }
      };

      Meteor.call('newUser', user, function (error, userId) {
        if (error) {
          Session.set('isLoggingIn', false);
          console.log('Error:', error);
          if (error.error === 403) {
            sAlert.error("Sorry, a user with that email address already exists.");
          } else {
            sAlert.error('We had trouble processing your request.');
          }
        } else {
          // Log the user in.
          Meteor.loginWithPassword(user.email, user.password, function(error){
            if(error){
              Session.set('isLoggingIn', false);
              console.log('Error:', error);
              sAlert.error('Sorry. We had trouble logging you in.');
            } else {
              Session.set('isLoggingIn', false);
              sAlert.success('Awesome! Your new account is ready to use.');
              resetForm();
            }
          });
        }
      });
    }
  }
});
