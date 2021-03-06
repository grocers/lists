Template.viewList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var listId = FlowRouter.getParam("id");
    self.subscribe('aList', listId, {
      onError: function (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'We could not process your last request.');
        FlowRouter.go('lists');
      },
      onReady: function () {
        self.subscribe('packingUnits');
        self.subscribe('listItems', listId);
        self.subscribe('openOrderForList', listId);
      }
    });
  });
});

// Shared Code
var getCurrentList = function () {
  var listId = FlowRouter.getParam("id");
  return Lists.findOne({_id: listId});
};
var hasItems = function () {
  var listId = FlowRouter.getParam("id");
  return !! Items.find({list: listId}).count();
};

Template.viewList.helpers({
  showHeaderSpinner: function () {
    return Session.get('updatingListName') || Session.get('removingItemFromList') || Session.get('savingChangesToAnItem');
  },
  canOrder: function () {
    var list = getCurrentList();
    var proceed = list.deliversOn && list.preferredStore && hasItems();
    if (!proceed) {
      return false;
    } else {
      var openOrder = Orders.findOne({list: list._id, fulfilled: false});
      return ! openOrder;
    }
  },
  hasOpenOrder: function () {
    var listId = FlowRouter.getParam("id");
    return !! Orders.findOne({list: listId, fulfilled: false});
  },
  orderDateFromNow: function () {
    var listId = FlowRouter.getParam("id");
    var order = Orders.findOne({list: listId, fulfilled: false});
    return order ? moment(order.createdAt).fromNow() : '';
  },
  hasItems: function () {
    return hasItems();
  },
  list: function () {
    var listId = FlowRouter.getParam("id");
    return Lists.findOne({_id: listId});
  },
  listItems: function () {
    var listId = FlowRouter.getParam("id");
    return Items.find({list: listId});
  },
  orderingListItems: function () {
    return Session.get('orderingListItems');
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
  deliveryDateFromNow: function () {
    var list = getCurrentList();
    return (list.deliversOn) ? moment(list.deliversOn).fromNow() : 'Not set';
  },
  showDeliveryDatePicker: function () {
    return Session.get('showDeliveryDatePicker');
  },
  updatingDeliveryDate: function () {
    return Session.get('updatingDeliveryDate');
  },
  userPreferredStore: function () {
    var list = getCurrentList();
    return (list.preferredStore) ? list.preferredStore : 'Not set';
  },
  showStoreOptions: function () {
    return Session.get('showStoreOptions');
  },
  storeOptions: function () {
    return [{name: 'Koala'}, {name: 'Shoprite'}, {name: 'Max Mart'}, {name: 'Marina Mall'}, {name: '37 Total Fruit Shop'}];
  },
  isSelected: function (store) {
    var list = getCurrentList();
    return list.preferredStore === store ? 'selected' : '';
  },
  updatingPreferredStore: function () {
    return Session.get('updatingPreferredStore');
  },
  replaceable: function (item) {
    return item.allowReplacement ? 'Yes' : 'No';
  }
});

Template.viewList.events({
  "change #list-name": function (event) {
    Session.set('updatingListName', true);
    var list = {
      name: $(event.target).val(),
      id: FlowRouter.getParam("id")
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
      brand: $('#item-brand').val(),
      quantity: $('#item-quantity').val(),
      packingUnit: $('#item-quantity-unit').val(),
      allowReplacement: !! $('#item-allow-replacement').is(':checked')
    };

    item.list = FlowRouter.getParam("id") || undefined;

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
        brand: $('#new-item-brand').val(),
        quantity: $('#new-item-quantity').val(),
        packingUnit: $('#item-quantity-unit').val(),
        allowReplacement: !! $('#new-item-allow-replacement').is(':checked')
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
  "change #new-item-description, change #new-item-brand, change #new-item-quantity, change #item-quantity-unit, change #new-item-allow-replacement": function (event) {
    Session.set('item-' + this._id + '-edited', true);
  },
  "click .delete-list": function (event) {
    event.preventDefault();
    var deletionInProgress = Session.get('deletingList');
    if (!deletionInProgress) {
      if (confirm('This action will permanently delete this list and of its contents. Do you want to proceed?')) {
        Session.set('deletingList', true);
        var listId = FlowRouter.getParam("id");
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
  },
  "click #set-delivery-date": function (event) {
    event.preventDefault();
    Session.set('showDeliveryDatePicker', true);

    var list = getCurrentList();
    var currentDeliveryDate = list.deliversOn;

    function enableDatePickerControl () {
      var deliveryDatePicker = document.getElementById('delivery-date-picker-box');
      if (deliveryDatePicker) {
        if (currentDeliveryDate) {
          $('.datetimepicker').datetimepicker({
            defaultDate: moment(currentDeliveryDate)
          });
        } else {
          $('.datetimepicker').datetimepicker({
            minDate: moment()
          });
        }
      } else {
        setTimeout(enableDatePickerControl, 1000);
      }
    }

    enableDatePickerControl();
  },
  "click #cancel-delivery-date-change": function (event) {
    Session.set('showDeliveryDatePicker', false);
  },
  "click #save-delivery-date": function (event) {
    var deliveryDate = $('#delivery-date').val();
    if (!deliveryDate) {
      return sAlert.warning('Please set a delivery date');
    }

    var deliveryDateMoment = new Date(deliveryDate).getTime(), 
        now = new Date().getTime();

    if (deliveryDateMoment < now) {
      return sAlert.warning('Please set a date in the future for the delivery date');    
    }

    var list = getCurrentList();
    Session.set('updatingDeliveryDate', true);
    Meteor.call('setDeliveryDate', {id: list._id, deliveryDate: deliveryDate}, function (error) {
      Session.set('updatingDeliveryDate', false);
      if (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
      } else {
        Session.set('showDeliveryDatePicker', false);
      }
    });
  },
  "click #set-preferred-store": function (event) {
    event.preventDefault();
    Session.set('showStoreOptions', true);
  },
  "click #cancel-preferred-store-change": function (event) {
    Session.set('showStoreOptions', false);
  },
  "click #save-preferred-store": function (event) {
    var preferredStore = $('#preferred-store-dropdown').val();
    if (!preferredStore) {
      return sAlert.warning('Please select a preferred store');
    }

    var list = getCurrentList();
    Session.set('updatingPreferredStore', true);
    Meteor.call('setPreferredStore', {id: list._id, preferredStore: preferredStore}, function (error) {
      Session.set('updatingPreferredStore', false);
      if (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
      } else {
        Session.set('showStoreOptions', false);
      }
    });
  },
  "click #order-list-items": function () {
    var listId = FlowRouter.getParam('id');
    Session.set('orderingListItems', true);
    Meteor.call('orderListItems', listId, function (error) {
      Session.set('orderingListItems', false);
      if (error) {
        console.log('Error:', error);
        sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
      } else {
        sAlert.success('Done');
      }
    });
  }
});
