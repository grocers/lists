/*
 * Publications: Addresses
 * Data publications for the Addresses collection.
*/

Meteor.publish('loggedInShopperAddress', function() {
  var user = this.userId;
  if (!user) {
    return [];
  }

  var data = Addresses.find({"user": user});
  return data;
});

Meteor.publish('shopperAddress', function(shopperId) {
  var userId = this.userId;
  if (!userId) {
    return [];
  }

  var currentUser = Meteor.users.findOne(userId);
  if (!currentUser) {
    return [];
  }

  var target = Addresses.findOne({"user": shopperId});
  if (!target) {
    return [];
  }

  if (target.user !== currentUser._id && !currentUser.profile.isAdmin) {
   return []; 
  }

  var data = Addresses.find({"user": shopperId});
  return data;
});
