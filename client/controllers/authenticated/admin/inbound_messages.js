//Common code
var getMessages = function () {
  return Messages.find({}, {sort: {createdAt: -1}}).fetch();
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
  }
});
