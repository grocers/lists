//Shopper Publications
Meteor.publish('aShopper', function(shopperId){
  var user = this.userId;
  if (!user) {
    return null;
  }

  return Meteor.users.find({_id: shopperId});
});

Meteor.publish('loggedInShopper', function(){
  var userId = this.userId;
  if (!userId) {
    return null;
  }

  return Meteor.users.find({_id: userId});
});

Meteor.publish('allShoppers', function(){
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

  return Meteor.users.find({"profile.isAdmin": false});
});

Meteor.publish('signupsThisWeek', function(){
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

  var startOfWeek = moment().startOf('week');

  return Meteor.users.find({
    "profile.isAdmin": false,
    createdAt: {
      $gte: new Date(startOfWeek)
    }
  });
});
