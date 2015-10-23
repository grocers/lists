// List Methods

Meteor.methods({
  createList: function (list) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    
    try {
      check(list, {
        name: String
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    var exists = Lists.findOne({name: new RegExp('^' + list.name + '$', 'i'), owner: Meteor.userId()});
    if (exists && exists.owner === Meteor.userId()) {
      throw new Meteor.Error('duplicate-name', 'You already have a list with that name.');
    }

    list.owner = Meteor.userId();
    list.createdAt = new Date();
    return Lists.insert(list);
  },
  updateList: function (list) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    
    try {
      check(list, {
        id: String,
        name: String
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    var target = Lists.findOne(list.id);
    if (!target) {
      throw new Meteor.Error('bad-inputs');
    }

    if (target.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-allowed');
    }

    var exists = Lists.findOne({name: new RegExp(list.name, 'i'), owner: Meteor.userId()});
    if (exists && exists.owner === Meteor.userId()) {
      throw new Meteor.Error('duplicate-name', 'You already have a list with that name.');
    }

    Lists.update({_id: target._id}, {$set: {name: list.name, updatedAt: new Date()}});
    return;
  },
  setDeliveryDate: function (list) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    
    try {
      check(list, {
        id: String,
        deliveryDate: String
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    var target = Lists.findOne(list.id);
    if (!target) {
      throw new Meteor.Error('bad-inputs');
    }

    if (target.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-allowed');
    }

    Lists.update({_id: target._id}, {$set: {deliversOn: new Date(list.deliveryDate), updatedAt: new Date()}});
    return;
  },
  setPreferredStore: function (list) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    
    try {
      check(list, {
        id: String,
        preferredStore: String
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    var target = Lists.findOne(list.id);
    if (!target) {
      throw new Meteor.Error('bad-inputs');
    }

    if (target.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-allowed');
    }

    Lists.update({_id: target._id}, {$set: {preferredStore: list.preferredStore, updatedAt: new Date()}});
    return;
  },
  deleteList: function (listId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      check(listId, String);
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    var list = Lists.findOne(listId);
    if (!list) {
      throw new Meteor.Error('not-found');
    }

    if (list.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    return Lists.remove({_id: listId});
  },
  orderListItems: function (listId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      check(listId, String);
    } catch (e) {
      throw new Meteor.Error(e.message);
    }

    var list = Lists.findOne(listId);
    if (!list) {
      throw new Meteor.Error('not-found');
    }

    if (list.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.call('createOrderForList', listId, function (error) {
      if (error) {
        console.log('SError:', error);
        throw new Meteor.Error('not-authorized');
      } else {
        var user = Meteor.user();
        var listItems = Items.find({list: listId});

        var config = {
          recipient: {
            name: user.profile.fullName,
            email: user.emails[0].address,
            listName: list.name,
            items: listItems.map(function (item) {
              return {
                description: item.description,
                brand: item.brand,
                howMany: item.quantity + '  ' + item.packingUnit
              };
            })
          }, 
          merge: true,
          merge_language: 'handlebars',
          merge_vars: ['name', 'listName', 'items'],
          subject: 'Order Confirmation',
          template: 'order-confirmation'
        };

        MandrillMailer.send(config, Meteor.bindEnvironment(function (error, response) {
          if (error) {
            console.log('ERROR: ' + err);
          } else {
            if (response.status === 'sent') {
              console.log('Success: ', response);
              // Meteor.users.update({_id: user._id}, {$set: {"resetToken.delivered": true}});
              return true;
            }
          }
        }, function () {
          console.log('Failed to bind environment');
        }));
      }
    });
    // return true;
  }
});
