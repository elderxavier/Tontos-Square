(function() {
	'use strict';

	angular
		.module('starter.common', ['ionic', 
                                      'selector-case',
                                      'calendar',
                                      'simple-tabs',
                                      'vertical-scroll',
                                      'event-emitter',
                                      'rating-stars',
                                      'r.elastic', 
                                      'et-toggle'])
		.value('geolib', window.geolib)
		.value('convert', window.convert);
})();