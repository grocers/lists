Template.createList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var listId = Session.get('listId');
    self.subscribe('listItems', listId);
    self.subscribe('aList', listId);
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

Template.createList.helpers({
  updatingListName: function () {
    return Session.get('updatingListName');
  },
  previouslySaved: function () {
    return !! Session.get('listId');
  },
  hasItems: function () {
    var listId = Session.get('listId');
    if (!listId) {
      return false;
    } else {
      return !! Items.find({list: listId}).count();
    }
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

    function enableDatePickerControl () {
      var deliveryDatePicker = document.getElementById('delivery-date-picker-box');
      if (deliveryDatePicker) {
        $('.datetimepicker').datetimepicker({
          minDate: moment()
        });
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
  }
});
