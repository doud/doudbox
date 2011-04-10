(function () {
	ddfrttw.strings = {
		getString: function(prop) {
			var props = prop.split('.'),
				string = ddfrttw.config.data.strings,
				args = arguments;
			for (var i = 0; i < props.length; i++)
				string = string[props[i]] || {};
			if (typeof(string) != "string")
				string = "";
			return string;
		},
		setString: function (prop, val) {
			var props = prop.split('.'),
				container = ddfrttw.config.data.strings;
			for (var i = 0; i < props.length - 1; i++) {
				if (!container[props[i]]) {
					container[props[i]] = {};
				}
				container = container[props[i]];
			}
			container[props[i]] = value;
		}
	};
})();
