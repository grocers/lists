// Routes Configuration
Exposed = FlowRouter.group();
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

// Authenticated Routes
var dashboard = Authenticated.group({
  prefix: '/dashboard'
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
