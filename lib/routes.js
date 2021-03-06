// Routes Configuration
Exposed = FlowRouter.group({
  name: 'public'
});

Authenticated = FlowRouter.group({
  triggersEnter: [
    function() {
      var route;
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        route = FlowRouter.current();
        if (route.route.name !== 'login') {
          Session.set('redirectAfterLogin', route.path);
        }
        return FlowRouter.go('login');
      }
    }
  ]
});

Exposed.route('/', {
  name: 'index',
  action: function () {
    BlazeLayout.render('siteLayout', {content: 'index'});
  }
});

Exposed.route('/signup', {
  name: 'signup',
  action: function () {
    BlazeLayout.render('siteLayout', {content: 'signup'});
  }
});

Exposed.route('/login', {
  name: 'login',
  action: function () {
    BlazeLayout.render('siteLayout', {content: 'login'});
  }
});

Exposed.route('/forgot-password', {
  name: 'forgotPassword',
  action: function () {
    BlazeLayout.render('siteLayout', {content: 'forgotPassword'});
  }
});

Exposed.route('/reset-password/:token', {
  name: 'resetPassword',
  action: function () {
    BlazeLayout.render('siteLayout', {content: 'resetPassword'});
  }
});

FlowRouter.route('/logout', {
  name: 'logout',
  action: function () {
    Meteor.logout(function (error) {
      if (error) {
        console.log('Error:', error);
        sAlert.error('We had trouble logging you out.');
      } else {
        FlowRouter.go('index');
      }
    });
  }
});

// Authenticated Routes
var dashboard = Authenticated.group({
  prefix: '/dashboard',
  triggersEnter: [
    function() {
      var currentRoute = FlowRouter.current();
      if (currentRoute.path !== '/login') { // If it equals '/login' theres no further action is required
        var user = Meteor.user();
        if (!user) {
          Session.set('redirectAfterLogin', FlowRouter.current().route.name); // Set this so we are sent back here after login
          return FlowRouter.go('index');
        } else {
          if (user.profile.isAdmin) {
            Session.set('redirectAfterLogin', FlowRouter.current().route.name); // Set this so we are sent back here after login
            return FlowRouter.go('adminOverview');
          }
        }
      }
    }
  ]
});

dashboard.route('/lists', {
  name: 'lists',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'lists'});
  }
});

dashboard.route('/lists/create', {
  name: 'createList',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'createList'});
  }
});

dashboard.route('/lists/:id', {
  name: 'viewList',
  action: function (params) {
    BlazeLayout.render('appLayout', {content: 'viewList'});
  }
});

dashboard.route('/account', {
  name: 'shopperAccount',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'shopperAccount'});
  }
});

// Admin Routes
var admin = Authenticated.group({
  prefix: '/admin',
  triggersEnter: [
    function() {
      var currentRoute = FlowRouter.current();
      if (currentRoute.path !== '/login') { // If it equals '/login' theres no further action is required
        var user = Meteor.user();
        if (!user) {
          Session.set('redirectAfterLogin', FlowRouter.current().route.name); // Set this so we are sent back here after login
          return FlowRouter.go('index');
        } else {
          if (!user.profile.isAdmin) {
            Session.set('redirectAfterLogin', FlowRouter.current().route.name); // Set this so we are sent back here after login
            return FlowRouter.go('lists');
          }
        }
      }
    }
  ]
});

admin.route('/overview', {
  name: 'adminOverview',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'adminDashboardLayout', dashboardContent: 'adminOverview'});
  }
});

admin.route('/shoppers', {
  name: 'adminShoppers',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'adminDashboardLayout', dashboardContent: 'adminShoppers'});
  }
});

admin.route('/shoppers/:id', {
  name: 'adminShopperDetails',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'adminDashboardLayout', dashboardContent: 'adminShopperDetails'});
  }
});

admin.route('/shoppers/:id/lists/:listid', {
  name: 'adminShopperDetailsViewList',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'adminDashboardLayout', dashboardContent: 'adminShopperDetailsViewList'});
  }
});

admin.route('/messages', {
  name: 'adminInboundMessages',
  action: function () {
    BlazeLayout.render('appLayout', {content: 'adminDashboardLayout', dashboardContent: 'adminInboundMessages'});
  }
});
