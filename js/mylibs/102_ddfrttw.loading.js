(function () {
	var nb = 0,
		elem = $('<div />', {
			'id': 'loading'
		}).hide().appendTo(ddfrttw.body);
	ddfrttw.loading = {
		init: function() {
			ddfrttw.debug.log("LOADING init\n ddfrttw.strings.getString('messages.loading') = "+ddfrttw.strings.getString('messages.loading'));
			elem.text(ddfrttw.strings.getString('messages.loading'));
		},
		reinit: function() {
			ddfrttw.debug.log("LOADING reinit");
			nb = 0;
			ddfrttw.loading.hide();
		},
		show: function() {
			elem.show();
		},
		hide: function() {
			elem.hide();
		},
		start: function() {
			ddfrttw.debug.log("LOADING start");
			if (nb == 0)
				ddfrttw.loading.show();
			nb++;
		},
		stop: function() {
			ddfrttw.debug.log("LOADING stop");
			nb = Math.max(nb-1, 0);
			if (nb == 0)
				ddfrttw.loading.hide();
		}
	};
})();
