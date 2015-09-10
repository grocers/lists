// User Methods

Meteor.methods({
  newUser: function (user) {
    check(user, {
      email: String,
      password: String,
      profile: Match.ObjectIncluding({fullName: String}) 
    });

    var exists = Meteor.users.findOne({"profile.telephone": user.profile.telephone});
    if (exists) {
      throw new Meteor.Error('duplicate-telephone', 'A user with that telephone number already exists');
    }

    return Accounts.createUser(user);
  }
});
