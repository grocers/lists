// Item Methods

Meteor.methods({
  createItem: function (item) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (item && item.quantity) {
      item.quantity = parseInt(item.quantity); 
    }

    try {
      check(item, {
        description: String,
        brand: Match.Optional(String),
        quantity: Number,
        packingUnit: String,
        list: String
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    if (!item.brand) {
      delete item.brand;
    }

    item.createdAt = new Date();
    return Items.insert(item);
  },
  updateItem: function (item) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (item && item.quantity) {
      item.quantity = parseInt(item.quantity); 
    }

    try {
      check(item, {
        id: String,
        description: String,
        brand: Match.Optional(String),
        quantity: Number,
        packingUnit: String
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    if (!item.brand) {
      delete item.brand;
    }

    var target = Items.findOne(item.id);
    if (!target) {
      throw new Meteor.Error('not-found', 'We couldn\'t understand your last request.');
    } else {
      var targetList = Lists.findOne(target.list);
      if (targetList.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized', 'You cannot edit another user\'s list items');
      }
    }

    var itemId = item.id; delete item.id;
    item.updatedAt = new Date();

    Items.update({_id: itemId}, {$set: item});
    return;
  },
  removeItem: function (itemId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      check(itemId, String);
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    var item = Items.findOne(itemId);
    if (!item) {
      throw new Meteor.Error('not-found');
    }

    var list = Lists.findOne({_id: item.list});
    if (list.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    return Items.remove({_id: itemId});
  }
});
