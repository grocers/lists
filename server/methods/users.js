// User Methods

Meteor.methods({
  newUser: function (user) {
    check(user, {
      email: String,
      password: String,
      profile: Match.ObjectIncluding({fullName: String}) 
    });

    return Accounts.createUser(user);
  }
});
