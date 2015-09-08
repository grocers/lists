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
        return FlowRouter.go('merchantLogin');
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
    BlazeLayout.render('siteLayoutNoNav', {body: 'merchantSignup'});
  }
});

Exposed.route('/login', {
  name: 'login',
  action: function () {
    BlazeLayout.render('siteLayoutNoNav', {body: 'merchantLogin'});
  }
});

// Authenticated Routes
var dashboard = Authenticated.group({
  prefix: '/dashboard'
});

dashboard.route('/home', {
  name: 'dashboardHome',
  action: function () {
    BlazeLayout.render('siteLayout');
    // console.log('entered dashboard home');
  }
});

