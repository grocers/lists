// Messages Publications

Meteor.publish('inboundMessages', function(){
  var userId = this.userId;
  if (!userId) {
    return [];
  }

  var user = Meteor.users.findOne(userId);
  if (!user) {
    return [];
  }

  if (!user.profile.isAdmin) {
    return [];
  }

  return Messages.find({}, {sort: {createdAt: -1}});
});
