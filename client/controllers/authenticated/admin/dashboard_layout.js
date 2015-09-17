Template.adminDashboardLayout.helpers({
  isActive: function () {
    var args = arguments;
    var routes = [];
    Object.keys(args).forEach(function (key) {
      if (typeof args[key] === 'string') {
        routes.push(args[key]);
      } 
    });

    return ActiveRoute.name(new RegExp(routes.join('|')));
  }
});
