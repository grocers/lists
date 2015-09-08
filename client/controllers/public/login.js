Template.login.helpers({
  logInInProgress: function () {
    return Session.get('logInInProgress');
  }
});

Template.login.events({
  "submit .form": function (event) {
    event.preventDefault();

    function resetForm() {
      $(event.target).trigger('reset');
    }

    var email = $('#email').val(),
      password = $('#password').val();

    if (!(email && password)) {
      sAlert.warning("All fields are required. Please check your inputs.");
      return;
    } else {
      // Display spinner & disable text fields
      Session.set('logInInProgress', true);

      // Create the user's account.
      var user = {
        email: email,
        password: password,
      };

      // Log the user in.
      Meteor.loginWithPassword(user.email, user.password, function(error){
        if(error){
          Session.set('logInInProgress', false);
          console.log('Error:', error);
          sAlert.error('We couldn\'t find an account with that email/password combination');
        } else {
          Session.set('logInInProgress', false);
          sAlert.success('Awesome! You are now logged in.');
          resetForm();
        }
      });
    }
  }
});
