(function () {
	var console = window.console;
	ddfrttw.debug = {
		log: function(msg, important) {
			if (!ddfrttw.config.data.debugMode)
				{return;}
			if (console && console.log)
				{console.log(msg);}
			else if (important)
				{alert(msg);}
		},
		error: function(msg, e) {
			if (!ddfrttw.config.data.debugMode)
				return;
			if (console && console.error)
				console.error(msg);
			else if (important)
				alert(msg);
		},
		fail: function(msg) {
			alert(ddfrttw.strings.getString('errors.failure'));
		}
	};
})();
