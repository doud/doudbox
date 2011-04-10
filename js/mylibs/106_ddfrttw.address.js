(function() {
	var isInit = false,
		pathNumber,
		callBeforeChange;
	ddfrttw.address = {
		init: function() {
			if (isInit)
				return;
			isInit = true;
			pathNumber = ddfrttw.config.path.split('/').length - 2;
			ddfrttw.debug.log("INIT ddfrttw.config.path : "+ddfrttw.config.path);
			ddfrttw.loading.start();
			$.address
				.init(function() {
					ddfrttw.loading.stop();
				})
				.tracker(null)	// disable the tracking for jquery address
				.change(function(e) {
					ddfrttw.debug.log("CHANGE\n e : "+e);
					ddfrttw.loading.reinit();
					if ($.isFunction(callBeforeChange)) {
						callBeforeChange();
						callBeforeChange = null;
					}
					var val = e.value;
					switch(e.pathNames[pathNumber]) {
						case 'index.html':
							ddfrttw.debug.log("CHANGE case index\n e.pathNames[pathNumber] = "+e.pathNames[pathNumber]);
							break;
						case 'cv.html':
							ddfrttw.debug.log("CHANGE case cv\n e.pathNames[pathNumber] = "+e.pathNames[pathNumber]);
							break;
						case 'contact.html':
							ddfrttw.debug.log("CHANGE case contact\n e.pathNames[pathNumber] = "+e.pathNames[pathNumber]);
							break;
						/*	
							ddfrttw.require(['contact'], function() {
								//ddfrttw.contact.init();
							});
						*/	
						default :
							ddfrttw.debug.log("CHANGE case default\n e.pathNames[pathNumber] = "+e.pathNames[pathNumber]);
							break;
					}
				});
		},
		change: function(url) {
			$.address.value(url);
		},
		addCallBeforeChange: function(clb) {
			callBeforeChange = clb;
		}
	};
})();
