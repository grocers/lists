Route = {};

Route.isPublicRoute = function (route) {
  if (route) {
    return route.group.name === 'public';
  } else {
    route = window.location.pathname;
    return route.indexOf('dashboard') === -1 && route.indexOf('admin') === -1;
  }
};
