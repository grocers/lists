TabularTables = {};

TabularTables.Shoppers = new Tabular.Table({
  name: "Shoppers",
  collection: Meteor.users,
  columns: [
    {data: "profile.fullName", title: "Full Name"},
    {data: "profile.telephone", title: "Phone Number"},
    {
      data: "emails", 
      title: "Email", 
      render: function (val, type, doc) {
        if (val.length === 0) {
          return '';
        } else {
          return val[0].address;
        }
      }
    },
    {
      tmpl: Meteor.isClient && Template.viewShopperDetails
    }
  ]
});
