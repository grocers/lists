Template.createList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var listId = Session.get('listId');
    self.subscribe('listItems', listId);
    self.subscribe('aList', listId);
    self.subscribe('openOrderForList', listId);
  });
});

Template.createList.onDestroyed(function () {
  Session.set('listId', null);
});

// Shared Code
var getCurrentList = function () {
  var listId = Session.get('listId');
  return Lists.findOne({_id: listId});
};

var hasItems = function () {
  var listId = Session.get('listId');
  return !! Items.find({list: listId}).count();
};

Template.createList.helpers({
  updatingListName: function () {
    return Session.get('updatingListName');
  },
  previouslySaved: function () {
    return !! Session.get('listId');
  },
  canOrder: function () {
    var list = getCurrentList();
    if (!list) { return false; }
    var proceed = list.deliversOn && list.preferredStore && hasItems();
    if (!proceed) {
      return false;
    } else {
      var openOrder = Orders.findOne({list: list._id, fulfilled: false});
      return ! openOrder;
    }
  },
  hasOpenOrder: function () {
    var listId = Session.get('listId');
    return !! Orders.findOne({list: listId, fulfilled: false});
  },
  orderDateFromNow: function () {
    var listId = Session.get('listId');
    var order = Orders.findOne({list: listId, fulfilled: false});
    return order ? moment(order.createdAt).fromNow() : '';
  },
  orderingListItems: function () {
    return Session.get('orderingListItems');
  },
  hasItems: function () {
    return hasItems();
  },
  listItems: function () {
    var listId = Session.get('listId');
    if (!listId) {
      return [];
    } else {
      return Items.find({list: listId});
    }
  },
  showAddItemForm: function () {
    return Session.get('showAddItemForm');
  },
  addingItemToList: function () {
    return Session.get('addingItemToList');
  },
  currentList: function () {
    return getCurrentList();
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

Template.createList.events({
  "change #list-name": function (event) {
    Session.set('updatingListName', true);
    if (Session.get('listId')) {
      var list = {
        name: $(event.target).val(),
        id: Session.get('listId')
      };
      Meteor.call('updateList', list, function (error) {
        Session.set('updatingListName', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          /*if (error.error === 'duplicate-name') {
            $(event.target).val('');
          }*/
          return;
        } else {
          console.log('update success...');
        }
      });
    } else {
      var listName = $(event.target).val();
      var list = {name: listName};
      Meteor.call('createList', list, function (error, listId) {
        Session.set('updatingListName', false);
        if (error) {
          console.log('Error:', error);
          sAlert.error(error.reason || 'Oops. We had trouble processing your last request.');
          // $(event.target).val('');
          return;
        } else {
          Session.set('listId', listId);
        }
      });
    }
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

    item.list = Session.get('listId') || undefined;

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
          Session.set('justAddedItem', itemId);
        }
      });
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
    var listId = Session.get('listId');
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
