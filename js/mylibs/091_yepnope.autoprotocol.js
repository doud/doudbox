yepnope.addFilter(function(resource){
  // protocol adding
  if (/^\/\//.test(resource.url)) {
    resource.url = window.location.protocol + resource.url;
  }
  return resource;
});

