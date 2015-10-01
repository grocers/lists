Template.adminShopperDetailsViewList.onCreated(function() {
  // Hide vieport border
  $('.viewport').addClass('no-border');

  var self = this;
  self.autorun(function() {
    var listId = FlowRouter.getParam("listid");
    self.subscribe('aList', listId, {
      onError: function (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'We could not process your last request.');
        FlowRouter.go('lists');
      },
      onReady: function () {
        self.subscribe('packingUnits');
        self.subscribe('listItems', listId);
      }
    });
  });
});

Template.adminShopperDetailsViewList.onDestroyed(function() {
  // Hide vieport border
  $('.viewport').removeClass('no-border');
});

// Shared Code
var getCurrentList = function () {
  var listId = FlowRouter.getParam("listid");
  return Lists.findOne({_id: listId});
};

Template.adminShopperDetailsViewList.helpers({
  showHeaderSpinner: function () {
    return Session.get('updatingListName') || Session.get('removingItemFromList') || Session.get('savingChangesToAnItem');
  },
  hasItems: function () {
    var listId = FlowRouter.getParam("listid");
    return !! Items.find({list: listId}).count();
  },
  list: function () {
    var listId = FlowRouter.getParam("listid");
    return Lists.findOne({_id: listId});
  },
  listItems: function () {
    var listId = FlowRouter.getParam("listid");
    return Items.find({list: listId});
  },
  showAddItemForm: function () {
    return Session.get('showAddItemForm');
  },
  addingItemToList: function () {
    return Session.get('addingItemToList');
  },
  isEditingItem: function (itemId) {
    return Session.get('editingItem-' + itemId);
  },
  isSavingChangesToItem: function (itemId) {
    return Session.get('savingChangesToItem-' + itemId);
  },
  deletingList: function () {
    return Session.get('deletingList');
  },
  shopperId: function () {
    return FlowRouter.getParam('id');
  },
  deliveryDateFromNow: function () {
    var list = getCurrentList();
    return (list.deliversOn) ? moment(list.deliversOn).fromNow() : 'Not set';
  },
  replaceable: function (item) {
    return item.allowReplacement ? 'Yes' : 'No';
  }
});

Template.adminShopperDetailsViewList.events({
  "change #list-name": function (event) {
    Session.set('updatingListName', true);
    var list = {
      name: $(event.target).val(),
      id: FlowRouter.getParam("listid")
    };
    Meteor.call('updateList', list, function (error) {
      Session.set('updatingListName', false);
      if (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
        return;
      } else {
        console.log('update success...');
      }
    });
  },
  "click .show-add-item-form-trigger": function (event) {
    Session.set('showAddItemForm', true);
  },
  "click .cancel-add-item": function (event) {
    Session.set('showAddItemForm', false);
  },
  "click .add-item-btn": function (event) {
    var item = {
      description: $('#item-description').val(),
      quantity: $('#item-quantity').val(),
      packingUnit: $('#item-quantity-unit').val()
    };

    item.list = FlowRouter.getParam("listid") || undefined;

    if (!(item.description && item.quantity && item.packingUnit)) {
      return sAlert.warning('All fields are required please.');
    } else {
      Session.set('addingItemToList', true);
      Meteor.call('createItem', item, function (error, itemId) {
        Session.set('addingItemToList', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
        } else {
          var form = $(event.target).parents('.form')[0];
          $(form).trigger('reset');
          Session.set('showAddItemForm', false);
        }
      });
    }
  },
  "click .edit-item-link": function (event) {
    event.preventDefault();
    Session.set('editingItem-' + this._id, true);
  },
  "click .cancel-edit-link": function (event) {
    event.preventDefault();
    Session.set('editingItem-' + this._id, false);
  },
  "click .save-changes-link": function (event) {
    event.preventDefault();
    var self = this; // self is the list item in question
    if (Session.get('item-' + this._id + '-edited')) {
      var item = {
        id: this._id,
        description: $('#new-item-description').val(),
        quantity: $('#new-item-quantity').val(),
        packingUnit: $('#item-quantity-unit').val()
      };

      if (!(item.description && item.quantity && item.packingUnit)) {
        sAlert.warning('You have left some fields empty.');
      } else {
        Session.set('savingChangesToItem-' + this._id, true);
        Session.set('savingChangesToAnItem', true);
        Meteor.call('updateItem', item, function (error) {
          Session.set('savingChangesToItem-' + self._id, false); // use self because 'this' is now fairy dust :)
          Session.set('savingChangesToAnItem', false);
          if (error) {
            console.log('Error:', error);
            sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          } else {
            sAlert.success('Your changes were saved successfully.');
            Session.set('editingItem-' + self._id, false);
          }
        });
      }
    } else {
      Session.set('editingItem-' + this._id, false);
    }
  },
  "click .remove-item-link": function (event) {
    event.preventDefault();
    if (confirm('Click OK to confirm. Or cancel to return.')) {
      Session.set('removingItemFromList', true);
      Meteor.call('removeItem', this._id, function (error) {
        Session.set('removingItemFromList', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          return;
        } else {
          sAlert.success('An item was successfully removed from this list.');
        }
      });
    }
  },
  "change #new-item-description, change #new-item-quantity, change #item-quantity-unit": function (event) {
    Session.set('item-' + this._id + '-edited', true);
  },
  "click .delete-list": function (event) {
    event.preventDefault();
    var deletionInProgress = Session.get('deletingList');
    if (!deletionInProgress) {
      if (confirm('This action will permanently delete this list and of its contents. Do you want to proceed?')) {
        Session.set('deletingList', true);
        var listId = FlowRouter.getParam("listid");
        Meteor.call('deleteList', listId, function (error) {
          Session.set('deletingList', false);
          if (error) {
            console.log('Error:', error);
            sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
            return;
          } else {
            sAlert.success('List was deleted successfully.');
            FlowRouter.go('lists');
          }
        });
      }
    }
  }
});
