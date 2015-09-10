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

    var exists = Lists.findOne({name: new RegExp(list.name, 'i'), owner: Meteor.userId()});
    if (exists && exists.owner === Meteor.userId()) {
      throw new Meteor.Error('duplicate-name', 'You already have a list with that name.');
    }

    list.owner = Meteor.userId();
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

    Lists.update({_id: target._id}, {$set: {name: list.name}});
    return;
  }
});
