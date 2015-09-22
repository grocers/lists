/*
 * Publications: Addresses
 * Data publications for the Addresses collection.
*/

Meteor.publish('loggedInShopperAddress', function(listId) {
  var user = this.userId;
  if (!user) {
    return [];
  }

  var data = Addresses.find({"user": user});
  return data;
});
