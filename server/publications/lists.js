/*
* Publications: Lists
* Data publications for the Lists collection.
*/

Meteor.publish('currentUserLists', function(){
  // If need be, Meteor gives us access to the current user via this.userId.
  // Example below shows using this.userId to locate documents where the
  // owner field is equal to a userId. Additionally, a fields projection is
  // added to specify which fields you want to return (where 1 = true and
  // 0 = false).

  var user = this.userId;
  if (!user) {
    return [];
  }
  var data = Lists.find({"owner": user});

  return data;
});
