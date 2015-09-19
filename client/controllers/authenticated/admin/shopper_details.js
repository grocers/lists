// Common code
var fetchShopper = function () {
  var shopperId = FlowRouter.getParam('id');
  return Meteor.users.findOne(shopperId);
};

Template.adminShopperDetails.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var shopperId = FlowRouter.getParam("id");
    self.subscribe('aShopper', shopperId, {
      onError: function (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'We could not process your last request.');
      },
      onReady: function () {
        self.subscribe('shopperLists', shopperId, {
          onError: function (error) {
            console.log('Error:', error);
            sAlert.error(error.reason || 'We could not process your last request.');
          },
          onReady: function () {
            // self.subscribe('shopperLists', shopperId);
            var lists = Lists.find({owner: shopperId});
            lists.forEach(function (list) {
              var listId = list._id;
              self.subscribe('listItems', listId);
            });
          }
        });
      }
    });
  });
});

Template.adminShopperDetails.helpers({
  shopper: function () {
    return fetchShopper();
  },
  shopperEmail: function () {
    var shopper = fetchShopper();
    return shopper.emails[0].address;
  },
  hasLists: function () {
    var shopperId = FlowRouter.getParam('id');
    return !! Lists.find({owner: shopperId}).count();
  },
  lists: function () {
    var shopperId = FlowRouter.getParam('id');
    return Lists.find({owner: shopperId});
  },
  itemsCount: function (listId) {
    var count = Items.find({list: listId}).count();
    return (count === 0) ? 'Empty' : ((count === 1) ? count + ' item' : count + ' items');
  }
});
