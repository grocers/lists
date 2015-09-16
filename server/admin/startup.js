/*
* Startup
* Functions to run on server startup. Note: this file is for calling functions
* only. Define functions in /server/admin/startup-functions.
*/

Meteor.startup(function(){

  // Create item packing units if not exist
  createItemPackingUnits();

  // Create admin user if not exist
  createAdmin(); 

});
