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

});
