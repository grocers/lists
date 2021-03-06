Template.shopperAccount.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('loggedInShopper');
    self.subscribe('loggedInShopperAddress');
  });
});

// Shared Code
var getUser = function () {
  return Meteor.user();
};

var clearNewAddressForm = function () {
  $('.new-address-input').val('');
};

var getCurrentAddress = function () {
  return Addresses.findOne({user: Meteor.userId()});
};

var addressHasCoordinates = function () {
  var address = getCurrentAddress();
  if (!address) {
    if (Session.get('addressLatitude') && Session.get('addressLongitude')) {
      return true;
    } else {
      return false;
    }
  } else {
    return address.latitude && address.longitude;
  }
};

var renderMap = function (center) {
  var map,
  mapOptions = {
    zoom: 17,
    center: { lat: center.latitude, lng: center.longitude},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('canvas'), mapOptions);

  var markerPosition = new google.maps.LatLng(center.latitude, center.longitude);
  var marker = new google.maps.Marker({
    position: markerPosition,
    title:"You are here"
  });

  marker.setMap(map);
};

Template.shopperAccount.helpers({
  shopper: function () {
    return getUser();
  },
  fullName: function () {
    return getUser().profile.fullName;
  },
  email: function () {
    return getUser().emails[0].address;
  },
  telephone: function () {
    return getUser().profile.telephone;
  },
  editingFullname: function () {
    return Session.get('editingFullname');
  },
  updatingFullname: function () {
    return Session.get('updatingFullname');
  },
  editingTelephone: function () {
    return Session.get('editingTelephone');
  },
  updatingTelephone: function () {
    return Session.get('updatingTelephone');
  },
  gettingCurrentLocation: function () {
    return Session.get('gettingCurrentLocation');
  },
  hasAddress: function () {
    return !! Addresses.findOne({user: Meteor.userId()});
  },
  currentAddress: function () {
    return getCurrentAddress();
  },
  editingCurrentAddressHouseNumber: function () {
    return Session.get('editingCurrentAddressHouseNumber');
  },
  updatingCurrentAddressHouseNumber: function () {
    return Session.get('updatingCurrentAddressHouseNumber');
  },
  editingCurrentAddressStreet: function () {
    return Session.get('editingCurrentAddressStreet');
  },
  updatingCurrentAddressStreet: function () {
    return Session.get('updatingCurrentAddressStreet');
  },
  editingCurrentAddressSuburb: function () {
    return Session.get('editingCurrentAddressSuburb');
  },
  updatingCurrentAddressSuburb: function () {
    return Session.get('updatingCurrentAddressSuburb');
  },
  editingCurrentAddressNotes: function () {
    return Session.get('editingCurrentAddressNotes');
  },
  updatingCurrentAddressNotes: function () {
    return Session.get('updatingCurrentAddressNotes');
  },
  bulkEditingCurrentAddressViaMaps: function () {
    return Session.get('bulkEditingCurrentAddressViaMaps');
  },
  bulkUpdatingCurrentAddress: function () {
    return Session.get('bulkUpdatingCurrentAddress');
  },
  addressIsPinnableOnMap: function () {
    return addressHasCoordinates();
  },
  renderMap: function () {
    Session.get('addressLatitude');
    Session.get('addressLongitude');

    function render () {
      if ($('#canvas').length === 0) {
        setTimeout(render, 2000);
      } else {
        var address = (Session.get('addressLatitude') && Session.get('addressLongitude')) ? {latitude: Session.get('addressLatitude'), longitude: Session.get('addressLongitude'), type: 'session'} : getCurrentAddress();
        renderMap({latitude: address.latitude, longitude: address.longitude});
      }
    }

    render();
  },
  isChangingPassword: function () {
    return Session.get('changingPassword');
  }
});

Template.shopperAccount.events({
  "click .edit-name": function (event) {
    event.preventDefault();
    Session.set('editingFullname', true);
  },
  "click .save-fullname-changes": function (event) {
    event.preventDefault();
    if (Session.get('fullnameEdited')) {
      var user = {
        id: Meteor.userId(),
        fullName: $('.fullname-edit-input').val()
      };

      if (!user.fullName) {
        return sAlert.warning('The name field cannot be blank.');
      }

      Session.set('updatingFullname', true);
      Meteor.call('updateFullname', user, function (error) {
        Session.set('updatingFullname', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          return;
        } else {
          Session.set('editingFullname', false);
          Session.set('fullnameEdited', false);
        }
      });
    } else {
      Session.set('editingFullname', false);
    }
  },
  "click .cancel-fullname-edit": function (event) {
    event.preventDefault();
    Session.set('editingFullname', false);
  },
  "change .fullname-edit-input": function (event) {
    event.preventDefault();
    Session.set('fullnameEdited', true);
  },
  "click .edit-telephone": function (event) {
    event.preventDefault();
    Session.set('editingTelephone', true);
  },
  "click .save-telephone-changes": function (event) {
    event.preventDefault();
    if (Session.get('telephoneEdited')) {
      var user = {
        id: Meteor.userId(),
        telephone: $('.telephone-edit-input').val()
      };

      if (!user.telephone) {
        return sAlert.warning('The telephone field cannot be blank.');
      }

      Session.set('updatingTelephone', true);
      Meteor.call('updateTelephone', user, function (error) {
        Session.set('updatingTelephone', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          return;
        } else {
          Session.set('editingTelephone', false);
          Session.set('telephoneEdited', false);
        }
      });
    } else {
      Session.set('editingTelephone', false);
    }
  },
  "click .cancel-telephone-edit": function (event) {
    event.preventDefault();
    Session.set('editingTelephone', false);
  },
  "change .telephone-edit-input": function (event) {
    event.preventDefault();
    Session.set('telephoneEdited', true);
  },
  "click #new-address-use-current-location": function () {
    event.preventDefault();
    Session.set('gettingCurrentLocation', true);
    Maps.getCurrentLocation(function (result) {
      Session.set('gettingCurrentLocation', false);

      $('#new-address-street-name').val(result.street);
      $('#new-address-suburb').val(result.suburb);
      Session.set('addressLatitude', result.latitude);
      Session.set('addressLongitude', result.longitude);
      alert("We have automatically filled out your STREET NAME and SUBURB. Please add your house number before saving.");
      renderMap({latitude: result.latitude, longitude: result.longitude});
    });
  },
  "click #new-address-save": function (event) {
    event.preventDefault();
    var houseNumber = $('#new-address-house-number').val(),
      street =$('#new-address-street-name').val(),
      suburb = $('#new-address-suburb').val(),
      notes = $('#new-address-notes').val();

    if (!(houseNumber && street && suburb)) {
      return sAlert.warning('Your address is missing some fields.');
    }

    var address = {
      houseNumber: houseNumber,
      street: street,
      suburb: suburb,
      notes: notes,
      latitude: Session.get('addressLatitude'),
      longitude: Session.get('addressLongitude'),
      user: Meteor.userId()
    };

    Maps.geoCoordsFromAddress(address, function (coords) {
      if (coords) {
        address.latitude = coords.latitude;
        address.longitude = coords.longitude;
      }

      Session.set('savingNewAddress', true);
      Meteor.call('newAddress', address, function (error) {
        if (error) {
          console.log('Error:', error);
          return sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
        } else {
          Session.set('addressLatitude', null);
          Session.set('addressLongitude', null);
          sAlert.success('Your address was saved successfully');
          clearNewAddressForm();
        }
      });
    });
  },
  "click .edit-current-address-house-number": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressHouseNumber', true);
  },
  "change #current-address-house-number": function (event) {
    Session.set('currentAddressHouseNumberEdited', true);
  },
  "click .cancel-current-address-house-number-edit": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressHouseNumber', false);
  },
  "click .save-current-address-house-number-changes": function (event) {
    event.preventDefault();
    if (Session.get('currentAddressHouseNumberEdited')) {
      var address = {
        id: getCurrentAddress()._id,
        houseNumber: $('#current-address-house-number').val()
      };

      if (!address.houseNumber) {
        return sAlert.warning('The house number field cannot be blank.');
      }

      Session.set('updatingCurrentAddressHouseNumber', true);
      Meteor.call('updateHouseNumber', address, function (error) {
        Session.set('updatingCurrentAddressHouseNumber', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          return;
        } else {
          Session.set('editingCurrentAddressHouseNumber', false);
          Session.set('currentAddressHouseNumberEdited', false);
        }
      });
    } else {
      Session.set('editingCurrentAddressHouseNumber', false);
    }
  },
  "click .edit-current-address-street": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressStreet', true);
  },
  "change #current-address-street-name": function (event) {
    Session.set('currentAddressStreetEdited', true);
  },
  "click .cancel-current-address-street-edit": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressStreet', false);
  },
  "click .save-current-address-street-changes": function (event) {
    event.preventDefault();
    if (Session.get('currentAddressStreetEdited')) {
      var address = {
        id: getCurrentAddress()._id,
        street: $('#current-address-street-name').val()
      };

      if (!address.street) {
        return sAlert.warning('The street field cannot be blank.');
      }

      var currentAddress = getCurrentAddress();
      var update = {
        houseNumber: currentAddress.houseNumber,
        street: address.street, // use the just typed in street
        suburb: currentAddress.suburb
      };

      Maps.geoCoordsFromAddress(update, function (coords) {
        if (coords) {
          address.latitude = coords.latitude;
          address.longitude = coords.longitude;
        }
        Session.set('updatingCurrentAddressStreet', true);
        Meteor.call('updateStreet', address, function (error) {
          Session.set('updatingCurrentAddressStreet', false);
          if (error) {
            console.log('Error:', error);
            sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
            return;
          } else {
            Session.set('editingCurrentAddressStreet', false);
            Session.set('currentAddressStreetEdited', false);
          }
        });
      });
    } else {
      Session.set('editingCurrentAddressStreet', false);
    }
  },
  "click .edit-current-address-suburb": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressSuburb', true);
  },
  "change #current-address-suburb": function (event) {
    Session.set('currentAddressSuburbEdited', true);
  },
  "click .cancel-current-address-suburb-edit": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressSuburb', false);
  },
  "click .save-current-address-suburb-changes": function (event) {
    event.preventDefault();
    if (Session.get('currentAddressSuburbEdited')) {
      var address = {
        id: getCurrentAddress()._id,
        suburb: $('#current-address-suburb').val()
      };

      if (!address.suburb) {
        return sAlert.warning('The suburb field cannot be blank.');
      }

      var currentAddress = getCurrentAddress();
      var update = {
        houseNumber: currentAddress.houseNumber,
        street: currentAddress.street,
        suburb: address.suburb  // use the just typed in suburb
      };

      Maps.geoCoordsFromAddress(update, function (coords) {
        if (coords) {
          address.latitude = coords.latitude;
          address.longitude = coords.longitude;
        }

        Session.set('updatingCurrentAddressSuburb', true);
        Meteor.call('updateSuburb', address, function (error) {
          Session.set('updatingCurrentAddressSuburb', false);
          if (error) {
            console.log('Error:', error);
            sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
            return;
          } else {
            Session.set('editingCurrentAddressSuburb', false);
            Session.set('currentAddressSuburbEdited', false);
          }
        });
      });
    } else {
      Session.set('editingCurrentAddressSuburb', false);
    }
  },
  "click .edit-current-address-notes": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressNotes', true);
  },
  "change #current-address-notes": function (event) {
    Session.set('currentAddressNotesEdited', true);
  },
  "click .cancel-current-address-notes-edit": function (event) {
    event.preventDefault();
    Session.set('editingCurrentAddressNotes', false);
  },
  "click .save-current-address-notes-changes": function (event) {
    event.preventDefault();
    if (Session.get('currentAddressNotesEdited')) {
      var address = {
        id: getCurrentAddress()._id,
        notes: $('#current-address-notes').val()
      };

      if (!address.notes) {
        return sAlert.warning('The notes field cannot be blank.');
      }

      Session.set('updatingCurrentAddressNotes', true);
      Meteor.call('updateNotes', address, function (error) {
        Session.set('updatingCurrentAddressNotes', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          return;
        } else {
          Session.set('editingCurrentAddressNotes', false);
          Session.set('currentAddressNotesEdited', false);
        }
      });
    } else {
      Session.set('editingCurrentAddressNotes', false);
    }
  },
  "click #current-address-use-current-location": function () {
    event.preventDefault();
    // Enter bulk editing mode (i.e. all address fields become editable/saveable at once)
    Session.set('gettingCurrentLocation', true);
    Session.set('editingCurrentAddressHouseNumber', true);
    Session.set('editingCurrentAddressStreet', true);
    Session.set('editingCurrentAddressSuburb', true);
    Session.set('editingCurrentAddressNotes', true);
    Session.set('bulkEditingCurrentAddressViaMaps', true);

    Maps.getCurrentLocation(function (result) {
      Session.set('gettingCurrentLocation', false);
      alert("We have automatically filled out your STREET NAME and SUBURB. Please double check the details before saving.");

      $('#current-address-street-name').val(result.street);
      $('#current-address-suburb').val(result.suburb);
      Session.set('currentAddressLatitude', result.latitude);
      Session.set('currentAddressLongitude', result.longitude);
      Session.set('addressLatitude', result.latitude);
      Session.set('addressLongitude', result.longitude);
    });
  },
  "click .bulk-save-current-address-changes": function (event) {
    var address = {
      id: getCurrentAddress()._id,
      houseNumber: $('#current-address-house-number').val(),
      street: $('#current-address-street-name').val(),
      suburb: $('#current-address-suburb').val(),
      notes: $('#current-address-notes').val()
    };

    if (!(address.houseNumber && address.street && address.suburb)) {
      return sAlert.warning('The address is missing some fields.');
    }

    address.latitude = Session.get('currentAddressLatitude');
    address.longitude = Session.get('currentAddressLongitude');

    Session.set('bulkUpdatingCurrentAddress', true);
    Meteor.call('updateAddress', address, function (error) {
      Session.set('bulkUpdatingCurrentAddress', false);
      if (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
        return;
      } else {
        Session.set('editingCurrentAddressHouseNumber', false);
        Session.set('editingCurrentAddressStreet', false);
        Session.set('editingCurrentAddressSuburb', false);
        Session.set('editingCurrentAddressNotes', false);
        Session.set('bulkEditingCurrentAddressViaMaps', false);
      }
    });
  },
  "click .cancel-password-change": function (event) {
    $('.form').trigger('reset');
  },
  "click .change-password": function (event) {
    var currentPassword = $('#current-password').val(),
      newPassword = $('#new-password').val(),
      confirmPassword = $('#confirm-password').val();

    if (!currentPassword) {
      return sAlert.warning('Please enter your current password.');
    }

    if (!newPassword) {
      return sAlert.warning('Please enter your new password.');
    }

    if (newPassword !== confirmPassword) {
      return sAlert.warning('Your new password and the confirmation password do not match.');
    }

    var digest = Package.sha.SHA256(currentPassword);
    
    Session.set('changingPassword', true);
    Meteor.call('checkPassword', digest, function(err, isValid) {
      if (isValid) {
        Meteor.call('setNewPassword', {id: Meteor.userId(), newPassword: newPassword}, false, function (error) {
          Session.set('changingPassword', false);
          if (error) {
            console.log('Error:', error);
            return sAlert.error(error.reason || 'We could not process your last request.');
          }

          Helpers.resetForm($('.form'));
          $('#change-password-modal').modal('hide');
          sAlert.success('Password changed.');
        });

      } else {
        Session.set('changingPassword', false);
        return sAlert.error('The value you entered as your current password is incorrect. Please check and try again.');
      }
    });
  }
});
