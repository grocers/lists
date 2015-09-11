createItemPackingUnits = function () {
  if (PackingUnits.find().count() === 0) {
    var packingUnits = [
      {value: 'Each'},
      {value: 'Piece'},
      {value: 'Bag'},
      {value: 'Bottle'},
      {value: 'Box'},
      {value: 'Case'},
      {value: 'Pack'},
      {value: 'Jar'},
      {value: 'Can'},
      {value: 'Bunch'},
      {value: 'Roll'},
      {value: 'Dozen'},
      {value: 'Small'},
      {value: 'Large'},
      {value: 'Pound'},
      {value: 'Ounce'},
      {value: 'Quartz'},
      {value: 'Cup'},
      {value: 'Gallon'}
    ];

    packingUnits.forEach(function (unit) {
      PackingUnits.insert(unit);
    });
  }
};
