(function() {
	ddfrttw.require = function(modules, clb) {
		var mod = [];
		$.each(modules, function(i, v) {
			mod.push('js/ddfrttw.'+v+'.js');
		});
		require(mod, clb); // to use once the require engine is set up
	};
	ddfrttw.require.init = function() {
		// Init and configure the require engine
	};
})();
