Url = {
  fromPathAndQueryParams: function (path, queryParams) {
    var params = Object.keys(queryParams);
    if (params.length === 0) {
      return path;
    }

    var url = path + "?";
    params.forEach(function (param, index) {
      url += param + "=" + queryParams[param] + (index < params.length - 1 ? "&" : ""); 
    });

    return url;
  }
};
