/*
 * Publications: Orders
 * Data publications for the Orders collection.
*/

Meteor.publish('openOrderForList', function(listId) {
  var user = this.userId;
  if (!user) {
    return [];
  }

  try {
    check(listId, String);
  } catch (e) {
    return [];
  } 

  var data = Orders.find({"list": listId, fulfilled: false});
  return data;
});
