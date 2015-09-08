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
    BlazeLayout.render('siteLayout', {upperFold: 'indexCallToAction'});
  }
});

var merchants = Exposed.group({
  prefix: '/merchants'
});

merchants.route('/signup', {
  name: 'merchantSignup',
  action: function () {
    BlazeLayout.render('siteLayoutNoNav', {body: 'merchantSignup'});
  }
});

merchants.route('/login', {
  name: 'merchantLogin',
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

