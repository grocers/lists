Template.lists.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('currentUserLists');  
  });
});

Template.lists.helpers({
  lists: function () {
    return Lists.find();
  },
  hasLists: function () {
    return !! Lists.find().count();
  }
});
