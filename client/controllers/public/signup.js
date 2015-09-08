Template.signup.helpers({
  accountCreationInProgress: function () {
    return Session.get('accountCreationInProgress');
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
      companyName =     $('#company-name').val(),
      password    =     $('#password').val();

    if (!(fullName && email && companyName && password)) {
      sAlert.warning("All fields are required. Please check your inputs.");
      return;
    } else {
      // Display spinner & disable text fields
      Session.set('accountCreationInProgress', true);

      // Create the user's account.
      var user = {
        email: email,
        password: password,
        profile: {
          fullName: fullName
        }
      };

      Meteor.call('newUser', user, function (error, userId) {
        if (error) {
          Session.set('accountCreationInProgress', false);
          console.log('NError:', error);
          if (error.error === 403) {
            sAlert.error("Sorry, a user with that email address already exists.");
          } else {
            sAlert.error('We had trouble processing your request.');
          }
        } else {
          // Create Merchant
          var shop = Session.get('shop'); // merchant shop url
          var merchantInfo = {
            name: companyName,
            accountOwner: userId
          };

          if (shop) {
            merchantInfo.shop = shop;
          }

          Meteor.call('createMerchant', merchantInfo, function (error) {
            if (error) {
              Session.set('accountCreationInProgress', false);
              console.log('Error:', error);
              sAlert.error('We had trouble processing your request.');
            } else {
              // Log the user in.
              Meteor.loginWithPassword(user.email, user.password, function(error){
                if(error){
                  Session.set('accountCreationInProgress', false);
                  console.log('Error:', error);
                  sAlert.error('Sorry. We had trouble logging you in.');
                } else {
                  Session.set('accountCreationInProgress', false);
                  sAlert.success('Awesome! Your new account is ready to use.');
                  resetForm();
                }
              });
            }
          });
        }
      });
    }
  }
});
