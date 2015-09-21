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
  },
  updateFullname: function (user) {
    try {
      check(user, {
        id: String,
        fullName: String
      });
    } catch (e) {
      throw new Meteor.Error('bad-parameter');
    }

    Meteor.users.update({_id: user.id}, {$set: {"profile.fullName": user.fullName}});
    return;
  },
  updateTelephone: function (user) {
    try {
      check(user, {
        id: String,
        telephone: String
      });
    } catch (e) {
      throw new Meteor.Error('bad-parameter');
    }

    Meteor.users.update({_id: user.id}, {$set: {"profile.telephone": user.telephone}});
    return;
  }
});
