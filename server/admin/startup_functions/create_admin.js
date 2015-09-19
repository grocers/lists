createAdmin = function () {
  var admin = {
    email: 'ewusipee@gmail.com',
    password: 'password',
    profile: {
      fullName: 'Nana Ewusi',
      telephone: '0207584976',
      isAdmin: true
    }
  };

  var exists = Meteor.users.findOne({'emails': {$elemMatch: {address: admin.email}}});
  if (!exists) {
    Accounts.createUser(admin);
  }
};
