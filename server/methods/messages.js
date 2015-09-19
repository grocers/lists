// Messages Methods

Meteor.methods({
  createMessage: function (message) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(message, {
      user: String,
      text: String
    });

    var sender = Meteor.users.findOne(message.user);
    if (!sender) {
      throw new Meteor.Error('not-found', 'User not found');
    }

    message.createdAt = new Date();
    message.read = false;
    message.userName = sender.profile.fullName;
    return Messages.insert(message);
  }
});

Meteor.methods({
  markAsRead: function (messageId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      check(messageId, String);
    } catch (e) {
      throw new Meteor.Error('bad-input', 'Invalid value supplied for parameter.');
    }

    Messages.update({_id: messageId}, {$set: {read: true, updatedAt: new Date()}});
    return;
  }
});
