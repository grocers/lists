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
  },
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
  },
  sendReply: function (messageId, replyText) {
    // return;
    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    if (!user.profile.isAdmin) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      check(messageId, String);
    } catch (e) {
      throw new Meteor.Error('bad-input', 'Invalid value supplied for parameter.');
    }

    var message = Messages.findOne(messageId);
    if (!message) {
      throw new Meteor.Error('message-not-found', 'Could not send reply');
    }

    var sender = Meteor.users.findOne(message.user);
    var howLongAgo = moment(message.createdAt).fromNow();
    var admin = user.profile.fullName;

    Messages.update({
      _id: message._id
    }, {
      $set: {
        reply: {
          text: replyText, 
          sentAt: new Date(), 
          sentBy: user._id,
          sentByName: admin,
          delivered: false
        }, 
        updatedAt: new Date()
      }
    });

    var messageConfig = {
      recipient: {
        name: sender.profile.fullName,
        email: sender.emails[0].address
      }, 
      subject: '[Grocers Support] A response for your last inquiry',
      text: 'Dear ' + sender.profile.fullName + ',<br /><br /> You left us a message ' + howLongAgo + '. ' + admin + ' just wrote a response to it. See the full message below: <br /><br /> <b>' + replyText + '</b><br /><br /> To respond to this message, please reply to admin@grocers.com.gh. <br /><br /> Have a great day.'
    };

    MandrillMailer.send(messageConfig, Meteor.bindEnvironment(function (error, response) {
      if (error) {
        console.log('ERROR: ' + err);
      } else {
        if (response.status === 'sent') {
          console.log('Success: ', response);
          Messages.update({_id: message._id}, {$set: {"reply.delivered": true}});
        }
      }
    }, function () {
      console.log('Failed to bind environment');
    }));

    return;
  }
});

