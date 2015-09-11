/*
 * Publications: PackingUnits
 * Data publications for the PackingUnits collection.
*/

Meteor.publish('packingUnits', function(){
  var user = this.userId;
  if (!user) {
    return [];
  }
  var data = PackingUnits.find();

  return data;
});
