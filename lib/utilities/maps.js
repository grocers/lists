Maps = {
  getCurrentLocation: function (done) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var geocoder = new google.maps.Geocoder(),
          latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        geocoder.geocode({
          'latLng': latLng}, 
          function (data, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              var street = data[0].address_components[0].long_name,
                suburb = data[0].address_components[1].long_name;

              done({
                street: street,
                suburb: suburb,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });

              // var renderMap = self.get('renderMap');
              // renderMap(position.coords);
              // $('.auto-location-success-modal').modal('show');
            } 
          });
      });
    } else {
      done(null);
    }
  }
};
