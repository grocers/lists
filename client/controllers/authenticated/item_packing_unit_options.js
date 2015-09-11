Template.itemPackingUnitOptions.onCreated(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('packingUnits');
  });
});

Template.itemPackingUnitOptions.helpers({
  packingUnits: function () {
    return PackingUnits.find();
  },
  shouldSelect: function (candidate, currentPackingUnit) {
    return candidate === currentPackingUnit;
  },
  isSavingChangesToItem: function (itemId) {
    return Session.get('savingChangesToItem-' + itemId);
  }
});
