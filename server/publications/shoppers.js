//Shopper Publications
Meteor.publish('aShopper', function(shopperId){
  var user = this.userId;
  if (!user) {
    return null;
  }

  return Meteor.users.find({_id: shopperId});
});

