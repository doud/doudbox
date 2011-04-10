( function ( yepnope ) {
  // add each prefix
  yepnope.addPrefix( 'css', function ( resource ) {
    // Set the force flag
    resource.forceCSS = true;
    //carry on
    return resource;
  } );
} )( this.yepnope );
