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

    message.createdAt = new Date();
    message.read = false;
    return Messages.insert(message);
  }
});
