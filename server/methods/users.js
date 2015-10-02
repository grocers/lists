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
  },
  hasAssociatedAccount: function (email) {
    try {
      check(email, String);
    } catch (e) {
      throw new Meteor.Error('bad-parameter');
    }

    return !! Meteor.users.findOne({'emails': {$elemMatch: {address: email}}});
  },
  checkPassword: function(digest) {
    check(digest, String);

    if (Meteor.userId()) {
      var user = Meteor.user();
      var password = {digest: digest, algorithm: 'sha-256'};
      var result = Accounts._checkPassword(user, password);
      return !result.error;
    } else {
      return false;
    }
  },
  setNewPassword: function (user, forceLogout) {
    forceLogout = forceLogout || false;
    try {
      check(user, {
        id: String,
        newPassword: String
      });
      check(forceLogout, Boolean);
    } catch (e) {
      throw new Meteor.Error('bad-parameter');
    }

    Accounts.setPassword(user.id, user.newPassword, {logout: forceLogout});

    var now = new Date(),
        yesterday = new Date(now.setDate(now.getDate() - 1));

    Meteor.users.update({_id: user.id}, {$set: {"resetToken.expires": yesterday}});
    return;
  },
  sendPasswordResetLink: function (email) {
    try {
      check(email, String);
    } catch (e) {
      throw new Meteor.Error('bad-parameter');
    }

    var user = Meteor.users.findOne({'emails': {$elemMatch: {address: email}}});
    if (!user) {
      return;
    }

    if (user.resetToken && user.resetToken.hash && user.resetToken.delivered && !Helpers.expired(user.resetToken.expires)) {
      // notify user an unused reset link exists
      throw new Meteor.Error('existing-token-found', 'We\'ve previously sent you a reset link that you haven\'t yet used. Please check your email and use that to reset your password');
    } else {
      // Create one
      var hash = Helpers.createHash(32);
      var now = new Date();
      var resetToken = {
        hash: hash,
        expires: new Date(now.setDate(now.getDate() + 1)) // 24 hour from now
      };

      // Update the user's record with the token
      Meteor.users.update({_id: user._id}, {$set: {"resetToken": resetToken}});

      var settings = process.env.NODE_ENV === 'production' ? {ROOT_URL: process.env.ROOT_URL} : Meteor.settings.public;

      var resetLink = settings.ROOT_URL + '/reset-password/' + encodeURIComponent(resetToken.hash);
      var config = {
        recipient: {
          name: user.profile.fullName,
          email: user.emails[0].address
        }, 
        subject: 'Reset your password - You requested this',
        text: 'Dear ' + user.profile.fullName + ',<br /><br /> To reset your password, simply click on <a href="' + resetLink + '">this link</a>. If you did not request to reset your password, simply ignore this email. This link will automatically expire in 24 hours.<br /><br /> Thank you.'
      };

      MandrillMailer.send(config, Meteor.bindEnvironment(function (error, response) {
        if (error) {
          console.log('ERROR: ' + err);
        } else {
          if (response.status === 'sent') {
            console.log('Success: ', response);
            Meteor.users.update({_id: user._id}, {$set: {"resetToken.delivered": true}});
            return resetToken;
          }
        }
      }, function () {
        console.log('Failed to bind environment');
      }));
    }
  }
});
