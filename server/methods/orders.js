// Item Methods
Meteor.methods({
  createOrderForList: function (listId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    var list = Lists.findOne({_id: listId});
    if (!list) {
      throw new Meteor.Error('not-found');
    }

    var listItems = Items.find({list: listId});

    var now = new Date();
    var order = {
      createdAt: now,
      updatedAt: now,
      fulfilled: false,
      customer: list.owner,
      customerName: Meteor.user().profile.fullName,
      list: listId,
      listName: list.name,
      items: listItems.map(function (item) {
        return {
          description: item.description,
          brand: item.brand,
          packingUnit: item.packingUnit,
          quantity: item.quantity,
          allowReplacement: item.allowReplacement
        };
      })
    };

    return Orders.insert(order);
  }
});
