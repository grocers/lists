Template.adminOverview.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('allShoppers');
    self.subscribe('signupsThisWeek');
    self.subscribe('listsAddedThisWeek');
  });
});

Template.adminOverview.helpers({
  allShoppersCount: function () {
    return Meteor.users.find({"profile.isAdmin": false}).count();
  },
  signupsThisWeek: function () {
    var startOfWeek = moment().startOf('week');
    return Meteor.users.find({
      "profile.isAdmin": false,
      createdAt: {
        $gte: new Date(startOfWeek)
      }
    }).count();
  },
  listsAddedThisWeek: function () {
    var startOfWeek = moment().startOf('week');
    return Lists.find({
      createdAt: {
        $gte: new Date(startOfWeek)
      }
    }).count();
  }
});
