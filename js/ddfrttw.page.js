(function() {
	ddfrttw.page = {
		show: function(url) {
			//window.console.log(">>>>>>>>>>>>>>>>> PAGE SHOW");
			var urlToLoad = url;
			//window.console.log("---- urlToLoad = ",urlToLoad);
			ddfrttw.loading.start();
			ddfrttw.ajax.load({
				url: urlToLoad,
				dataType: 'html',
				success: function(data) {

					//window.console.log("\nddfrttw.ajax.load SUCCESS from ddfrttw.page.show");
					//window.console.log("---- data = ", data);
					//window.console.log("---- going to showContent\n");

					ddfrttw.showContent(data);

					ddfrttw.loading.stop();
					//window.console.log(">>>>>>>>>>>>>>>>> END PAGE SHOW");
				},
				error: function() {
					ddfrttw.error();
					ddfrttw.loading.stop();
				}
			});
		}
	};
})();
