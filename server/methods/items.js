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
        quantity: Number,
        packingUnit: String,
        list: String
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    return Items.insert(item);
  }
});
