// Users Publications
Meteor.publish('userByResetToken', function(token) {
  // For us to return the user, the token will have to be valid and unexpired
  try {
    check(token, String);
  } catch (e) {
    throw new Meteor.Error('400', 'You passed a bad token value');
  }

  var user = Meteor.users.findOne({"resetToken.hash": token});
  if (!user) {
    throw new Meteor.Error('400', 'Sorry. This link is invalid'); 
  }

  if (Helpers.expired(user.resetToken.expires)) {
    throw new Meteor.Error('400', 'Sorry. This link has expired.'); 
  }

  return Meteor.users.find({_id: user._id});
});
