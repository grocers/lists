Template.index.helpers({
  setupInProgress: function () {
    return !! Session.get("setupInProgress");
  }
});
Template.index.events({
  "submit .get-started": function (event) {
    event.preventDefault();
    var shopName = $("#store-name").val();
    if (!shopName) {
      return sAlert.error("Please provide a valid Shopify store name");
    }

    Session.set("setupInProgress", true);
    shopName = shopName.replace(".myshopify.com", "");

    var permissionRequestUrl = ShopifyClient.oauth.generatePermissionsUrl(shopName);
    ShopifyClient.oauth.saveNonce(shopName, permissionRequestUrl, function (error, response) {
      if ( error ) {
        console.log("ERROR:", error.message);
        sAlert.error("Sorry, we had trouble creating your account.");
      } else {
        if (response.statusCode === 201) {
          console.log("SUCCESS: ", response.statusCode);
          Session.set("setupInProgress", false);
          window.location.href = permissionRequestUrl;
        }
      }
    });
  }
});
