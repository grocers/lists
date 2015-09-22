// Addresses Methods

Meteor.methods({
  newAddress: function (address) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(address, {
      houseNumber: String,
      street: String,
      suburb: String,
      latitude: Match.Optional(Number),
      longitude: Match.Optional(Number),
      user: String
    });

    var owner = Meteor.users.findOne(address.user);
    if (!owner) {
      throw new Meteor.Error('not-found', 'User not found');
    }

    address.createdAt = new Date();
    // message.userName = sender.profile.fullName;
    return Addresses.insert(address);
  },
  updateHouseNumber: function (address) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(address, {
      houseNumber: String,
      id: String
    });

    var currentUser = Meteor.users.findOne(Meteor.userId());
    if (!currentUser) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    
    var target = Addresses.findOne(address.id);
    if (!target) {
      throw new Meteor.Error('not-found', 'Address not found');
    }

    if (target.user !== currentUser._id) {
      if (!currentUser.profile.isAdmin) {
        throw new Meteor.Error('not-authorized', 'You cannot edit another user\'s address');
      }
    }

    Addresses.update({_id: address.id}, {$set: {"houseNumber": address.houseNumber, updatedAt: new Date()}});
    return;
  },
  updateStreet: function (address) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(address, {
      street: String,
      id: String
    });

    var currentUser = Meteor.users.findOne(Meteor.userId());
    if (!currentUser) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    
    var target = Addresses.findOne(address.id);
    if (!target) {
      throw new Meteor.Error('not-found', 'Address not found');
    }

    if (target.user !== currentUser._id) {
      if (!currentUser.profile.isAdmin) {
        throw new Meteor.Error('not-authorized', 'You cannot edit another user\'s address');
      }
    }

    Addresses.update({_id: address.id}, {$set: {"street": address.street, updatedAt: new Date()}});
    return;
  },
  updateSuburb: function (address) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(address, {
      suburb: String,
      id: String
    });

    var currentUser = Meteor.users.findOne(Meteor.userId());
    if (!currentUser) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    
    var target = Addresses.findOne(address.id);
    if (!target) {
      throw new Meteor.Error('not-found', 'Address not found');
    }

    if (target.user !== currentUser._id) {
      if (!currentUser.profile.isAdmin) {
        throw new Meteor.Error('not-authorized', 'You cannot edit another user\'s address');
      }
    }

    Addresses.update({_id: address.id}, {$set: {"suburb": address.suburb, updatedAt: new Date()}});
    return;
  },
  updateAddress: function (address) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(address, {
      houseNumber: String,
      street: String,
      suburb: String,
      id: String
    });

    var currentUser = Meteor.users.findOne(Meteor.userId());
    if (!currentUser) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    
    var target = Addresses.findOne(address.id);
    if (!target) {
      throw new Meteor.Error('not-found', 'Address not found');
    }

    if (target.user !== currentUser._id) {
      if (!currentUser.profile.isAdmin) {
        throw new Meteor.Error('not-authorized', 'You cannot edit another user\'s address');
      }
    }

    Addresses.update({_id: address.id}, {$set: {"houseNumber": address.houseNumber, "street": address.street, "suburb": address.suburb, updatedAt: new Date()}});
    return;
  }
});
