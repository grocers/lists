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
  var userId = this.userId;
  if (!userId) {
    return null;
  }

  var user = Meteor.users.findOne(userId);
  if (!user) {
    return null;
  }

  var list = Lists.findOne({_id: listId});
  if (list.owner !== userId && !user.profile.isAdmin) {
    throw new Meteor.Error('not-authorized', 'You cannot view another user\'s lists');
  }

  return Lists.find({_id: listId});
});

Meteor.publish('shopperLists', function(shopperId) {
  var user = this.userId;
  if (!user) {
    return [];
  }

  try {
    check(shopperId, String);
  } catch (e) {
    return [];
  } 

  var data = Lists.find({"owner": shopperId});
  return data;
});

Meteor.publish('listsAddedThisWeek', function(){
  console.log('++');
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

  var results = Lists.find({
    createdAt: {
      $gte: new Date(startOfWeek)
    }
  });
  console.log('--', results.count());
  return results;
});
