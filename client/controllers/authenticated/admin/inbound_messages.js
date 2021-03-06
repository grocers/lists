//Common code
var getMessages = function () {
  return Messages.find({}, {sort: {createdAt: -1}}).fetch();
};

var getMessage = function (messageId) {
  return Messages.findOne(messageId);
};

Template.adminInboundMessages.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('inboundMessages');
  });
});

Template.adminInboundMessages.helpers({
  hasMessages: function () {
    return !! Messages.find().count();
  },
  unreadMessages: function () {
    return getMessages().filter(function (message) {
      return !message.read;
    });
  },
  readMessages: function () {
    return getMessages().filter(function (message) {
      return message.read;
    });
  },
  fromNow: function (date) {
    return moment(date).fromNow();
  },
  currentMessage: function () {
    return Session.get('currentMessage');
  },
  unread: function (message) {
    var read = Session.get('message-' + message._id + '-read');
    if (read === undefined) {
      return !message.read;
    } else {
      return !read;
    }
  },
  preview:function (text) {
    return text.substr(0, 15) + '...'; 
  },
  sendingMessageReply: function (message) {
    return Session.get('sendingMessage-' + message._id + '-reply');
  },
  hasReply: function (message) {
    return !! message.reply;
  },
  howLongAgo: function (reply) {
    return moment(reply.sentAt).fromNow();
  }
});

Template.adminInboundMessages.events({
  "click .message": function () {
    Session.set('message-' + this._id + '-read', true);
    Session.set('currentMessage', this);

    Meteor.call('markAsRead', this._id, function (error) {
      Session.set('message-' + this._id + '-read', true);
      if (error) {
        console.log('Error:', error);
        return sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
      } else {
        console.log('Message marked as read...');
      }
    });
  },
  "click .reply-button": function () {
    var replyText = $('#reply-text').val();
    if (!replyText) {
      return sAlert.warning('Please write a reply message before sending');
    }

    var message = getMessage(Session.get('currentMessage')._id); 

    Session.set('sendingMessage-' + message._id + '-reply', true);
    Meteor.call('sendReply', message._id, replyText, function (error) {
      Session.set('sendingMessage-' + message._id + '-reply', false);
      if (error) {
        console.log('Error:', error);
        return sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
      } else {
        var messages = getMessages();
        var messageRepliedTo = lodash.find(messages, {_id: message._id});
        Session.set('currentMessage', messageRepliedTo);
      }
    });
  }
});
