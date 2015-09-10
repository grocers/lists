/*
 * Publications: Items
 * Data publications for the Items collection.
*/

Meteor.publish('listItems', function(listId) {
  var user = this.userId;
  if (!user) {
    return [];
  }

  try {
    check(listId, String);
  } catch (e) {
    return [];
  } 

  var data = Items.find({"list": listId});
  return data;
});
