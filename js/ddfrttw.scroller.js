(function() {
	var isIE6 = BrowserDetect.isIE6();
	$.fn.extend({
		scroller: function(forceHeight) {
			return this.each(function() {
				var cont = $(this),
					maxHeight = forceHeight || cont.height(),
					curHeight = cont.css('height'),
					ratio = 1,
					ratioScroll = 1,
					contentHeight = Math.max(cont.height(), cont.get(0).scrollHeight);
				if (isIE6) {
					cont.wrap('<div style="overflow: auto; height: 20px" />').css('height', 'auto');
					contentHeight = cont.height();
					cont.css('height', curHeight).unwrap();
				}
				function move() {
					cont.scrollTop(parseInt(cont.data('scroller').css('top')) / cont.data('ratioScroll'));
				}

				if (!cont.data('scrollerInit')) {
					var wrapper = cont
						.wrap('<div class="wrapperScroll"></div>')
						.parent()
							.mousewheel(function(e, d) {
								if (cont.data('scroller').is(':visible')) {
									var tmp = cont.data('scroller').css('top'),
											top = parseInt(tmp == 'auto' ? 0 : tmp) - d*10,
										maxTop = cont.data('maxTop');
									if (top < 0)
										top = 0;
									else if (top > maxTop)
										top = maxTop;
									e.preventDefault();
									e.stopPropagation();
									cont.data('scroller').css('top', top);
									move();
								}
							})
							.append('<div class="scrollerCont"><div class="scroller"><aside class="png_bg scroller_up"></aside><aside class="png_bg scroller_down"></aside></div></div>');
					var scrollerCont = $('.scrollerCont', wrapper).hide(),
						scroller = $('.scroller', scrollerCont);
					cont.data('scrollerInit', true);
					cont.data('scrollerCont', scrollerCont);
					cont.data('scroller', scroller);
					cont.css('overflow', 'hidden');
				}

				var scrollerCont = cont.data('scrollerCont');
				var scroller = cont.data('scroller')
					.draggable('destroy')
					.draggable({
						axis: 'y',
						zIndex: 99999,
						containment: scrollerCont,
						scroll: false,
						drag: move
					});
				if (contentHeight > maxHeight) {
					scrollerCont.show().height(maxHeight);
					ratio = maxHeight / contentHeight;
					cont.height(maxHeight).css('overflow', 'hidden');
					var scrollerHeight = Math.round(maxHeight * ratio);
					scroller.height(scrollerHeight);

					var scrollingHeight = maxHeight - scrollerHeight;
					ratioScroll = scrollingHeight / (contentHeight-maxHeight);

					cont.data('ratioScroll', ratioScroll);
					cont.data('maxTop', scrollingHeight);
				} else {
					scrollerCont.hide();
				}
			});
		},
		rescroller: function() {
			return this.each(function() {
				var cont = $(this);
				if (cont.scrollTop(0).data('scroller')) {
					cont.data('scroller').css('top', 0);
				}
				cont.scroller();
			});
		},
		unscroller: function() {
			return this.each(function() {
				var cont = $(this);
				if (cont.data('scrollerInit')) {
					cont.css({overflow: ''}).unwrap();
					cont.data('scrollerCont').remove();
					cont.data('scrollerInit', false);
				}
			});
		}
	});
})();
