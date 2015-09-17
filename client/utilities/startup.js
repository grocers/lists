Meteor.startup(function () {

  sAlert.config({
    effect: 'stackslide',
    position: 'bottom-right',
    timeout: 5000,
    html: false,
    onRouteClose: true,
    stack: true,
    offset: 0
  });

  $(window).scroll(function () {
    var pos = $(window).scrollTop();
    if (pos <= 40) {
      // normal styling
      $('.viewport').removeClass('floated');
    } else {
      $('.viewport').addClass('floated');
    }
  });

});
