Template.createList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var listId = Session.get('listId');
    self.subscribe('listItems', listId);
  });
});

Template.createList.onDestroyed(function () {
  Session.set('listId', null);
});

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
      packingUnit: $('#item-quantity-unit').val()
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
  }
});
