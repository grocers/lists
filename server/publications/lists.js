/*
* Publications: Lists
* Data publications for the Lists collection.
*/

Meteor.publish('currentUserLists', function(){
  var user = this.userId;
  if (!user) {
    return [];
  }
  var data = Lists.find({"owner": user});

  return data;
});

Meteor.publish('aList', function(listId){
  var user = this.userId;
  if (!user) {
    return null;
  }

  var data = Lists.find({_id: listId});
  if (data.owner !== user) {
    console.log('throwing error');
    throw new Meteor.Error('not-authorized', 'You cannot view another user\'s lists');
  }

  return data;
});
