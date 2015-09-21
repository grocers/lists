Template.shopperAccount.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('loggedInShopper');
  });
});

// Shared Code
var getUser = function () {
  return Meteor.user();
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
  }
});
